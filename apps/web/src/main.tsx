import "./styles/v2-landing.css";
import "./styles/v2-chat-workspace.css";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './styles.css';
// import './deployed-route-cohesion.css'
// import './passkey-auth.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
