import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, Heart } from 'lucide-react';
import { getWishlistCount } from '../utils/wishlist';
import './Header.css';

const Header = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [wishlistCount, setWishlistCount] = React.useState(getWishlistCount());

  React.useEffect(() => {
    const updateCount = () => setWishlistCount(getWishlistCount());
    window.addEventListener('wishlistUpdated', updateCount);
    // Also listen for storage changes in other tabs
    window.addEventListener('storage', updateCount);
    return () => {
      window.removeEventListener('wishlistUpdated', updateCount);
      window.removeEventListener('storage', updateCount);
    };
  }, []);

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo">
          <img src="/logo.svg" alt="Five Star Exporters" className="logo-img" />
          <span className="logo-text">Five Star <span className="logo-accent">Exporters</span></span>
        </Link>

        {/* Desktop Navigation - Visible on Desktop */}
        <nav className="desktop-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/modules" className="nav-link">Modules</Link>
          <Link to="/catalogue" className="nav-link">Catalogue</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </nav>



        <div className="header-actions">
          {user && user.role !== 'admin' && (
            <Link to="/dashboard" className="icon-link" title="Wishlist" onClick={() => localStorage.setItem('fivestar_dash_tab', 'wishlist')}>
              <Heart size={22} color={wishlistCount > 0 ? '#ef4444' : 'currentColor'} fill={wishlistCount > 0 ? '#ef4444' : 'none'} />
              {wishlistCount > 0 && <span className="badge wishlist-badge">{wishlistCount}</span>}
            </Link>
          )}

          <Link to="/cart" className="icon-link" title="Cart">
            <ShoppingCart size={22} />
            {(user?.cart?.reduce((acc, item) => acc + item.quantity, 0) || 0) > 0 && (
              <span className="badge cart-badge">
                {user.cart.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </Link>

          {user && (
            <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="icon-link desktop-only" title="Dashboard">
              <User size={22} />
            </Link>
          )}

          {!user && (
            <Link to="/login" className="btn btn-primary desktop-only">Login</Link>
          )}

          {/* Mobile Menu Toggle - Always visible for quick access */}
          <button className="menu-toggle" onClick={() => setIsMenuOpen(true)} title="Menu">
            <Menu size={26} />
          </button>
        </div>
      </div>

      {/* Offcanvas Sidebar Overlay */}
      <div className={`offcanvas-overlay ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(false)}></div>

      {/* Offcanvas Sidebar */}
      <nav className={`offcanvas-nav ${isMenuOpen ? 'open' : ''}`}>
        <div className="offcanvas-header">
          <h3>Menu</h3>
          <button className="close-btn" onClick={() => setIsMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* User Info in Sidebar */}
        {user && (
          <div className="offcanvas-user-info">
            <div className="user-avatar">
              <User size={20} />
            </div>
            <div>
              <p className="user-name-sidebar">Hi, {user.name}</p>
              <p className="user-email-sidebar">{user.email}</p>
            </div>
          </div>
        )}

        <div className="offcanvas-links">
          <Link to="/" className="offcanvas-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/about" className="offcanvas-link" onClick={() => setIsMenuOpen(false)}>About</Link>
          <Link to="/modules" className="offcanvas-link" onClick={() => setIsMenuOpen(false)}>Modules</Link>
          <Link to="/catalogue" className="offcanvas-link" onClick={() => setIsMenuOpen(false)}>Catalogue</Link>
          <Link to="/contact" className="offcanvas-link" onClick={() => setIsMenuOpen(false)}>Contact</Link>

          <div className="offcanvas-divider"></div>

          {user ? (
            <>
              {user.role === 'admin' ? (
                <Link to="/admin" className="offcanvas-link highlight" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
              ) : (
                <Link to="/dashboard" className="offcanvas-link highlight" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
              )}
              <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="offcanvas-link logout_btn">Logout</button>
            </>
          ) : (
            <Link to="/login" className="offcanvas-link highlight" onClick={() => setIsMenuOpen(false)}>Login / Sign Up</Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
