import React, { useState, useEffect } from 'react';
import { Search, Filter, Box, Heart } from 'lucide-react';
import { toggleWishlist, isInWishlist } from '../utils/wishlist';
import { Link, useNavigate } from 'react-router-dom';
import { productAPI, cartAPI } from '../api';
import './Catalogue.css';

const Catalogue = ({ user, onCartUpdate }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch products from backend API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await productAPI.getAll(searchTerm, selectedCategory);
                setProducts(data);
            } catch (error) {
                console.error('Failed to load products:', error);
            } finally {
                setLoading(false);
            }
        };

        // Debounce search
        const timer = setTimeout(fetchProducts, 300);
        return () => clearTimeout(timer);
    }, [searchTerm, selectedCategory]);

    const addToCart = async (e, productId) => {
        e.stopPropagation();
        e.preventDefault();
        if (!user) {
            alert("Please Login to add items to your cart.");
            navigate('/login');
            return;
        }
        try {
            await cartAPI.add(productId);
            if (onCartUpdate) onCartUpdate();
            alert("Item added to cart!");
        } catch (error) {
            alert(error.message || "Failed to add to cart");
        }
    };

    const handleWishlistToggle = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
        // Force re-render to update heart state
        setProducts([...products]);
    };

    const categories = ["All", "Grippers", "Cutters", "Dobby Parts", "Belts & Tapes", "Race Boards", "Heald & Droppers", "Leno Parts", "Electronics", "Drive Parts", "Bearings", "Hooks", "General Spares"];

    return (
        <div className="catalogue-page container section">
            <div className="catalogue-header">
                <h1 className="page-title">Spare Parts Catalogue</h1>
                <p className="catalogue-count">{loading ? 'Loading...' : `${products.length} products found`}</p>
                <div className="search-bar">
                    <Search size={20} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by part name or code (e.g. A001)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="catalogue-layout">
                {/* Sidebar Filters */}
                <aside className="filters-sidebar">
                    <div className="filter-group">
                        <h3><Filter size={18} /> Categories</h3>
                        <ul>
                            {categories.map(cat => (
                                <li
                                    key={cat}
                                    className={selectedCategory === cat ? 'active' : ''}
                                    onClick={() => setSelectedCategory(cat)}
                                >
                                    {cat}
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="product-grid">
                    {loading && (
                        <div className="no-results">
                            <Box size={48} />
                            <h3>Loading products...</h3>
                        </div>
                    )}
                    {!loading && products.length === 0 && (
                        <div className="no-results">
                            <Box size={48} />
                            <h3>No products found</h3>
                            <p>Try adjusting your search or filter criteria.</p>
                        </div>
                    )}
                    {products.map((product, index) => (
                        <Link
                            to={`/product/${product.partCode || product.id}`}
                            className="product-card-link animate-fade-up"
                            key={product.partCode || product.id}
                            style={{ animationDelay: `${(index % 10) * 0.1}s` }}
                        >
                            <div className="product-card">
                                <button
                                    className={`wishlist-btn-card ${isInWishlist(product.partCode || product.id) ? 'active' : ''}`}
                                    onClick={(e) => handleWishlistToggle(e, product)}
                                    title="Add to Wishlist"
                                >
                                    <Heart size={18} fill={isInWishlist(product.partCode || product.id) ? '#ef4444' : 'none'} color={isInWishlist(product.partCode || product.id) ? '#ef4444' : 'currentColor'} />
                                </button>
                                <div className="product-code-badge">{product.partCode || product.id}</div>
                                <div className="product-info">
                                    <span className="badge success">{product.inStock !== false ? 'In Stock' : 'Out of Stock'}</span>
                                    <h3>{product.name}</h3>
                                    <p className="product-category">{product.category}</p>
                                    <div className="product-action-row">
                                        <p className="product-price">{product.price}</p>
                                        <button className="btn-icon-small" onClick={(e) => addToCart(e, product.partCode || product.id)} title="Add to Cart">+</button>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Catalogue;
