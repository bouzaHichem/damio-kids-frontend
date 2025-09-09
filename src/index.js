import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ShopContextProvider from './Context/ShopContext';
import { I18nProvider } from './utils/i18n';
import { Provider } from 'react-redux';
import store from './store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <I18nProvider>
    <Provider store={store}>
      <ShopContextProvider>
        <App />
      </ShopContextProvider>
    </Provider>
  </I18nProvider>
);
