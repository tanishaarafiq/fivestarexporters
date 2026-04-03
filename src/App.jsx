import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Modules from './pages/Modules';
import Catalogue from './pages/Catalogue';
import ProductDetails from './pages/ProductDetails';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Reports from './pages/Reports';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { authAPI } from './api';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const token = localStorage.getItem('fivestar_token');
    if (token) {
      try {
        const userData = await authAPI.getMe();
        setUser(userData);
        localStorage.setItem('fivestar_user', JSON.stringify({ id: userData._id, email: userData.email }));
      } catch (error) {
        localStorage.removeItem('fivestar_token');
        localStorage.removeItem('fivestar_user');
        setUser(null);
      }
    }
  };

  
  useEffect(() => {
    refreshUser().finally(() => setLoading(false));

    // Initialize Global Theme
    const isDark = localStorage.getItem('fivestar_theme') === 'dark';
    if (isDark) document.body.classList.add('dark-theme');
  }, []);

  const handleLogin = (userData) => {
    // Save token to localStorage and set user
    if (userData.token) {
      localStorage.setItem('fivestar_token', userData.token);
      localStorage.setItem('fivestar_user', JSON.stringify({ id: userData._id, email: userData.email }));
    }
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('fivestar_token');
    localStorage.removeItem('fivestar_user');
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0A192F', color: '#FFD700', fontSize: '1.2rem' }}>
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/admin" element={<AdminDashboard user={user} onLogout={handleLogout} />} />
        <Route path="*" element={
          <Layout user={ user } onLogout={handleLogout}>
            <Routes>
              <Route path="/" element={<Home user={user} />} />
              <Route path="/about" element={<About />} />
              <Route path="/modules" element={<Modules user={user} />} />
              <Route path="/catalogue" element={<Catalogue user={user} onCartUpdate={refreshUser} />} />
              <Route path="/product/:id" element={<ProductDetails onCartUpdate={refreshUser} />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cart" element={<Cart user={user} onCartUpdate={refreshUser} />} />
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/dashboard" element={<UserDashboard user={user} />} />
              <Route path="/reports" element={<Reports user={user} />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
