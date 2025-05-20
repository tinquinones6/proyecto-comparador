import './styles/home.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App';
import Login from './pages/Login';
import Home from './pages/Home';
import AdminPanel from './pages/AdminPanel';
import Perfil from './pages/Perfil';
import PrivateRoute from './PrivateRoute';

import { SidebarProvider } from './context/SidebarContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SidebarProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Área protegida (con sidebar y contenido) */}
          <Route path="/" element={<PrivateRoute><App /></PrivateRoute>}>
            <Route index element={<Home />} />                {/* / */}
            <Route path="admin" element={<AdminPanel />} />   {/* /admin */}
            <Route path="perfil" element={<Perfil />} />      {/* /perfil */}
          </Route>
        </Routes>
      </BrowserRouter>
    </SidebarProvider>
  </React.StrictMode>
);