import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ShopContextProvider from './Context/ShopContext';
import { I18nProvider } from './utils/i18n';
import { Provider } from 'react-redux';
import store from './store';
import { Toaster } from 'react-hot-toast';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <I18nProvider>
    <Provider store={store}>
      <ShopContextProvider>
        <>
          <App />
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 2200,
              style: {
                borderRadius: '10px',
                background: '#111827',
                color: '#fff',
              },
            }}
          />
        </>
      </ShopContextProvider>
    </Provider>
  </I18nProvider>
);
