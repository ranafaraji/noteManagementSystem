import React from 'react';
import ReactDOM from 'react-dom/client';
import './login.css';
import './note.css';
import './home.css';
import './textEditor.css'
import App from './App';

import { AuthProvider } from './context/AuthProvider';
import { UserContextProvider } from './hooks/userContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';


const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //<QueryClientProvider client={queryClient}>
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <UserContextProvider>
          <Routes>
            
            <Route path="/*" element={<App />} />
          </Routes>
        </UserContextProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>
  //</QueryClientProvider>
);
