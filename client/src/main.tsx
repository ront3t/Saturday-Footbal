import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Load user on app start
import { store } from './store/store';
import { loadUser } from './store/slices/authSlice';

// Check if user is logged in on app start
const token = localStorage.getItem('token');
if (token) {
  store.dispatch(loadUser());
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);