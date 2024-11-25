import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { RemotionRoot } from './Root';

const container = document.getElementById('root');
const root = createRoot(container);

// Check if we're in Remotion Preview mode
const isRemotionPreview = window.location.pathname === '/preview';

root.render(
  <React.StrictMode>
    {isRemotionPreview ? <RemotionRoot /> : <App />}
  </React.StrictMode>
);
