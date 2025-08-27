/*
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
*/

import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext'; 

createRoot(document.getElementById("root")!).render(
  <AuthProvider> {/*  Wrap the App inside AuthProvider */}
    <App />
  </AuthProvider>
);
