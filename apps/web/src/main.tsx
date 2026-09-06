import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './design-system.css';
import './public.css';
import './workspace.css';
import './styles.css';
// import './deployed-route-cohesion.css'
// import './passkey-auth.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
