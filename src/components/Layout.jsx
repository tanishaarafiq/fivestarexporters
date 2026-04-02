import React from 'react';
import Header from './Header';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';

const Layout = ({ children, user, onLogout }) => {
    return (
        <div className="app-layout">
            <Header user={user} onLogout={onLogout} />
            <main className="main-content">
                {children}
            </main>
            <Footer />
            <WhatsAppButton />
        </div>
    );
};

export default Layout;
