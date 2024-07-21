// server/hydrate.tsx

import React from 'react';
import '../src/index.css';
import App from '../src/App';
import { BrowserRouter } from 'react-router-dom';
import { HeadProvider } from 'react-head';
import { hydrateRoot } from 'react-dom/client';

const root = document.getElementById('root');
if (!root) {
  throw new Error("Root dom node not found");
}
hydrateRoot(
  root,
  <HeadProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </HeadProvider>
);