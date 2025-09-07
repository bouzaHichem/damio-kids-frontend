import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ShopContextProvider from './Context/ShopContext';
import { I18nProvider } from './utils/i18n';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <I18nProvider>
    <ShopContextProvider>
      <App />
    </ShopContextProvider>
  </I18nProvider>
);
