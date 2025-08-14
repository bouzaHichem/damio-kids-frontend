// PWA Utilities for service worker management and offline functionality

class PWAManager {
  constructor() {
    this.registration = null;
    this.isOnline = navigator.onLine;
    this.listeners = {
      online: [],
      offline: [],
      beforeinstallprompt: [],
      updateAvailable: []
    };
    
    this.init();
  }
  
  async init() {
    // Register service worker
    if ('serviceWorker' in navigator) {
      try {
        this.registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });
        
        console.log('Service Worker registered successfully:', this.registration);
        
        // Check for updates
        this.checkForUpdates();
        
        // Listen for updates
        this.registration.addEventListener('updatefound', () => {
          const newWorker = this.registration.installing;
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version available
              this.emit('updateAvailable', newWorker);
            }
          });
        });
        
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
    
    // Setup online/offline listeners
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.emit('online');
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.emit('offline');
    });
    
    // Handle install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.emit('beforeinstallprompt', e);
    });
    
    // Setup background sync
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      this.setupBackgroundSync();
    }
  }
  
  // Event management
  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
  }
  
  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }
  
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }
  
  // Service worker management
  async checkForUpdates() {
    if (this.registration) {
      await this.registration.update();
    }
  }
  
  async skipWaiting() {
    if (this.registration && this.registration.waiting) {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }
  
  // Install prompt
  async showInstallPrompt(installPrompt) {
    if (installPrompt) {
      const result = await installPrompt.prompt();
      return result.outcome === 'accepted';
    }
    return false;
  }
  
  // Check if app is installable
  isInstallable() {
    // Check if running in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return false;
    }
    
    // Check if already installed
    if (window.navigator.standalone === true) {
      return false;
    }
    
    return true;
  }
  
  // Offline functionality
  async queueAction(action) {
    if (!this.isOnline) {
      await this.storeOfflineAction(action);
      return { success: true, offline: true };
    }
    
    try {
      const result = await this.executeAction(action);
      return { success: true, result };
    } catch (error) {
      // If online but request failed, queue for later
      await this.storeOfflineAction(action);
      throw error;
    }
  }
  
  async storeOfflineAction(action) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('DamioKidsOffline', 1);
      
      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['pendingActions'], 'readwrite');
        const store = transaction.objectStore('pendingActions');
        
        const actionWithId = {
          ...action,
          id: Date.now() + Math.random(),
          timestamp: new Date().toISOString()
        };
        
        const addRequest = store.add(actionWithId);
        addRequest.onsuccess = () => resolve(actionWithId);
        addRequest.onerror = () => reject(addRequest.error);
      };
      
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('pendingActions')) {
          const store = db.createObjectStore('pendingActions', { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('type', 'type', { unique: false });
        }
      };
    });
  }
  
  async executeAction(action) {
    const { type, data, url, method = 'POST' } = action;
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...action.headers
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  }
  
  // Background sync
  async setupBackgroundSync() {
    if (this.registration) {
      await this.registration.sync.register('background-sync');
    }
  }
  
  // Push notifications
  async requestNotificationPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }
  
  async subscribeToPushNotifications() {
    if (!this.registration) {
      throw new Error('Service Worker not registered');
    }
    
    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(process.env.REACT_APP_VAPID_PUBLIC_KEY)
      });
      
      return subscription;
    } catch (error) {
      console.error('Push subscription failed:', error);
      throw error;
    }
  }
  
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    
    return outputArray;
  }
  
  // Cache management
  async clearCache(cacheName) {
    if ('caches' in window) {
      await caches.delete(cacheName);
    }
  }
  
  async getCacheSize() {
    if ('caches' in window && 'storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        used: estimate.usage,
        quota: estimate.quota,
        percentage: Math.round((estimate.usage / estimate.quota) * 100)
      };
    }
    return null;
  }
  
  // Network status
  getNetworkStatus() {
    return {
      online: this.isOnline,
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt
      } : null
    };
  }
}

// Create singleton instance
const pwaManager = new PWAManager();

export default pwaManager;

// React hooks for PWA functionality
export const usePWA = () => {
  const [isOnline, setIsOnline] = React.useState(pwaManager.isOnline);
  const [installPrompt, setInstallPrompt] = React.useState(null);
  const [updateAvailable, setUpdateAvailable] = React.useState(false);
  
  React.useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    const onInstallPrompt = (prompt) => setInstallPrompt(prompt);
    const onUpdateAvailable = () => setUpdateAvailable(true);
    
    pwaManager.on('online', onOnline);
    pwaManager.on('offline', onOffline);
    pwaManager.on('beforeinstallprompt', onInstallPrompt);
    pwaManager.on('updateAvailable', onUpdateAvailable);
    
    return () => {
      pwaManager.off('online', onOnline);
      pwaManager.off('offline', onOffline);
      pwaManager.off('beforeinstallprompt', onInstallPrompt);
      pwaManager.off('updateAvailable', onUpdateAvailable);
    };
  }, []);
  
  const installApp = async () => {
    if (installPrompt) {
      const accepted = await pwaManager.showInstallPrompt(installPrompt);
      if (accepted) {
        setInstallPrompt(null);
      }
      return accepted;
    }
    return false;
  };
  
  const updateApp = async () => {
    await pwaManager.skipWaiting();
    window.location.reload();
  };
  
  return {
    isOnline,
    installPrompt: installPrompt ? installApp : null,
    updateAvailable,
    updateApp,
    isInstallable: pwaManager.isInstallable(),
    networkStatus: pwaManager.getNetworkStatus()
  };
};

// Hook for offline actions
export const useOfflineActions = () => {
  const queueAction = async (action) => {
    return await pwaManager.queueAction(action);
  };
  
  return { queueAction };
};
