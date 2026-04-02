import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, MessageSquare, CheckCircle, Truck, Box, Heart } from 'lucide-react';
import { productAPI, cartAPI } from '../api';
import { recordProductView } from '../utils/recentViews';
import { toggleWishlist, isInWishlist } from '../utils/wishlist';
import './ProductDetails.css';

const ProductDetails = ({ onCartUpdate }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const data = await productAPI.getByPartCode(id);
                setProduct(data);
                // Record the view
                recordProductView(data);
            } catch (err) {
                setError(err.message || 'Product not found');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        const token = localStorage.getItem('fivestar_token');
        if (!token) {
            alert("Please Login to add items to your cart.");
            navigate('/login');
            return;
        }
        try {
            await cartAPI.add(product.partCode);
            if (onCartUpdate) onCartUpdate();
            alert("Item added to cart!");
        } catch (err) {
            alert(err.message || "Failed to add to cart");
        }
    };

    const handleWishlistToggle = () => {
        toggleWishlist(product);
        // Force re-render
        setProduct({ ...product });
    };

    if (loading) {
        return (
            <div className="product-details-page container section" style={{ textAlign: 'center', padding: '80px 20px' }}>
                <Box size={60} color="#ccc" />
                <h2>Loading product...</h2>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="product-details-page container section" style={{ textAlign: 'center', padding: '80px 20px' }}>
                <Box size={60} color="#ccc" />
                <h2>Product Not Found</h2>
                <p>The product you're looking for doesn't exist.</p>
                <Link to="/catalogue" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>Back to Catalogue</Link>
            </div>
        );
    }

    return (
        <div className="product-details-page container section">
            <Link to="/catalogue" className="back-link animate-fade-up">&larr; Back to Catalogue</Link>

            <div className="product-details-grid">
                {/* Product Image / Code Display */}
                <div className="product-image-large animate-zoom">
                    <div className="product-code-large">{product.partCode}</div>
                    <Box size={100} className="floating-box" />
                </div>

                {/* Product Info */}
                <div className="product-info-details animate-fade-up">
                    <h1 className="product-title">{product.name}</h1>
                    <p className="product-meta">Category: <span>{product.category}</span> | Part Code: <span>{product.partCode}</span></p>

                    <div className="price-section">
                        <h2 className="price">{product.price}</h2>
                        <span className={`status-badge ${product.inStock !== false ? 'success' : 'danger'}`}>
                            {product.inStock !== false ? 'In Stock' : 'Out of Stock'}
                        </span>
                    </div>

                    <p className="description">{product.description}</p>

                    <div className="action-buttons">
                        <button className="btn btn-primary add-cart-btn" onClick={handleAddToCart}>
                            <ShoppingCart size={18} /> Add to Procurement Cart
                        </button>
                        <button
                            className={`btn btn-secondary wishlist-btn-large ${isInWishlist(product.partCode) ? 'active' : ''}`}
                            onClick={handleWishlistToggle}
                        >
                            <Heart size={18} fill={isInWishlist(product.partCode) ? '#ef4444' : 'none'} color={isInWishlist(product.partCode) ? '#ef4444' : 'currentColor'} />
                            {isInWishlist(product.partCode) ? ' In Wishlist' : ' Add to Wishlist'}
                        </button>
                        <Link to="/contact" className="btn btn-secondary enquiry-btn">
                            <MessageSquare size={18} /> Technical Enquiry
                        </Link>
                    </div>

                    <div className="features-list">
                        <div className="feature-item">
                            <CheckCircle size={18} className="feature-icon" />
                            <span>Precision Tested</span>
                        </div>
                        <div className="feature-item">
                            <Truck size={18} className="feature-icon" />
                            <span>Global Shipping</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Specifications */}
            <div className="specs-section">
                <h2 className="section-title">Product Information</h2>
                <table className="specs-table">
                    <tbody>
                        <tr>
                            <td className="spec-label">Part Code</td>
                            <td className="spec-value">{product.partCode}</td>
                        </tr>
                        <tr>
                            <td className="spec-label">Product Name</td>
                            <td className="spec-value">{product.name}</td>
                        </tr>
                        <tr>
                            <td className="spec-label">Category</td>
                            <td className="spec-value">{product.category}</td>
                        </tr>
                        <tr>
                            <td className="spec-label">Price</td>
                            <td className="spec-value">{product.price}</td>
                        </tr>
                        <tr>
                            <td className="spec-label">Availability</td>
                            <td className="spec-value">{product.inStock !== false ? 'In Stock' : 'Out of Stock'}</td>
                        </tr>
                        <tr>
                            <td className="spec-label">Origin</td>
                            <td className="spec-value">Five Star Exporters, India</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductDetails;
