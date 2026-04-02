import React from 'react';
import { MessageCircle } from 'lucide-react';
import './WhatsAppButton.css';

const WhatsAppButton = () => {
    const phoneNumber = '916382464950';
    const message = encodeURIComponent('Hello Five Star Exporters, I have a strategic query regarding your industrial spare parts.');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    return (
        <a
            href={whatsappUrl}
            className="whatsapp-float"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contact us on WhatsApp"
        >
            <div className="whatsapp-pulse"></div>
            <MessageCircle size={28} />
            <span className="whatsapp-tooltip">Strategic Support</span>
        </a>
    );
};

export default WhatsAppButton;
