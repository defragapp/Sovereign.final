import React from 'react';
import ReactDOM from 'react-dom/client';
import './tokens.css';
import './design-system.css';
import './public.css';
import './workspace.css';
import './app-shell.css';
import './styles.css';
import './styles/v2-landing.css';
import './styles/v2-chat-workspace.css';
import './deployed-route-cohesion.css';
import './passkey-auth.css';
import { App } from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
