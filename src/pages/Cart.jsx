import React, { useState, useEffect } from 'react';
import { Trash2, CreditCard, CheckCircle, Truck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cartAPI, orderAPI } from '../api';
import './Cart.css';

const Cart = ({ user, onCartUpdate }) => {
    const [step, setStep] = useState(1); // 1: Cart, 2: Details, 3: Payment, 4: Success
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [orderLoading, setOrderLoading] = useState(false);
    const [orderId, setOrderId] = useState('');
    const navigate = useNavigate();

    const [paymentMethod, setPaymentMethod] = useState('Razorpay');

    const [formData, setFormData] = useState({
        fullName: '',
        address: '',
        city: '',
        state: '',
        zip: '',
    });

    // Fetch cart from backend
    useEffect(() => {
        const fetchCart = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                const data = await cartAPI.get();
                setCartItems(data);
            } catch (error) {
                console.error('Failed to load cart:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, [user]);

    // Parse price string like "₹5,060" to number
    const parsePrice = (priceStr) => {
        if (!priceStr) return 0;
        return parseFloat(priceStr.replace(/[₹,]/g, '')) || 0;
    };

    const handleQuantityChange = async (item, delta) => {
        const newQty = Math.max(1, item.quantity + delta);
        try {
            const updatedCart = await cartAPI.update(item.product.partCode, newQty);
            setCartItems(updatedCart);
            if (onCartUpdate) onCartUpdate();
        } catch (error) {
            alert(error.message || 'Failed to update quantity');
        }
    };

    const handleRemove = async (item) => {
        try {
            const updatedCart = await cartAPI.remove(item.product.partCode);
            setCartItems(updatedCart);
            if (onCartUpdate) onCartUpdate();
        } catch (error) {
            alert(error.message || 'Failed to remove item');
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((acc, item) => acc + (parsePrice(item.product?.price) * item.quantity), 0);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNext = () => {
        setStep(step + 1);
    };

    const handlePlaceOrder = async () => {
        setOrderLoading(true);
        try {
            const orderData = {
                items: cartItems.map(item => ({
                    product: item.product._id,
                    name: item.product.name,
                    quantity: item.quantity,
                    price: item.product.price,
                })),
                shippingAddress: formData,
                totalAmount: calculateTotal(),
                paymentMethod: paymentMethod, // Use state instead of hardcoded
            };

            const order = await orderAPI.place(orderData);
            setOrderId(order._id);
            setCartItems([]);
            setStep(4);
        } catch (error) {
            alert(error.message || 'Failed to place order');
        } finally {
            setOrderLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="cart-page container section">
                <h1 className="page-title">Shopping Cart</h1>
                <div className="empty-cart" style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <p>Please login to view your cart.</p>
                    <Link to="/login" className="btn btn-primary" style={{ marginTop: '15px', display: 'inline-block' }}>Login</Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="cart-page container section">
                <h1 className="page-title">Shopping Cart</h1>
                <p style={{ textAlign: 'center', padding: '40px' }}>Loading your cart...</p>
            </div>
        );
    }

    return (
        <div className="cart-page container section">
            <h1 className="page-title">
                {step === 1 && 'Shopping Cart'}
                {step === 2 && 'Order Details'}
                {step === 3 && 'Payment'}
                {step === 4 && 'Order Confirmation'}
            </h1>

            {/* Progress Steps */}
            <div className="checkout-steps">
                <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Cart</div>
                <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Details</div>
                <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Payment</div>
                <div className={`step ${step >= 4 ? 'active' : ''}`}>4. Done</div>
            </div>

            <div className="cart-content">
                {step === 1 && (
                    <div className="cart-view">
                        {cartItems.length > 0 ? (
                            <>
                                <table className="cart-table">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Price</th>
                                            <th>Quantity</th>
                                            <th>Total</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartItems.map(item => (
                                            <tr key={item._id}>
                                                <td>
                                                    <div className="cart-product-info">
                                                        <div className="cart-img-placeholder"></div>
                                                        <span>{item.product?.name || 'Product'}</span>
                                                    </div>
                                                </td>
                                                <td>{item.product?.price || '₹0'}</td>
                                                <td>
                                                    <div className="quantity-controls">
                                                        <button onClick={() => handleQuantityChange(item, -1)}>-</button>
                                                        <span>{item.quantity}</span>
                                                        <button onClick={() => handleQuantityChange(item, 1)}>+</button>
                                                    </div>
                                                </td>
                                                <td>₹{(parsePrice(item.product?.price) * item.quantity).toLocaleString('en-IN')}</td>
                                                <td>
                                                    <button onClick={() => handleRemove(item)} className="remove-btn">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="cart-summary">
                                    <h3>Total: ₹{calculateTotal().toLocaleString('en-IN')}</h3>
                                    <button onClick={handleNext} className="btn btn-primary">Proceed to Checkout</button>
                                </div>
                            </>
                        ) : (
                            <div className="empty-cart">
                                <p>Your cart is empty.</p>
                                <Link to="/catalogue" className="btn btn-primary">Browse Catalogue</Link>
                            </div>
                        )}
                    </div>
                )}

                {step === 2 && (
                    <div className="details-form">
                        <h2>Shipping Information</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Address</label>
                                <textarea name="address" value={formData.address} onChange={handleInputChange} required></textarea>
                            </div>
                            <div className="form-group">
                                <label>City</label>
                                <input type="text" name="city" value={formData.city} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>State</label>
                                <input type="text" name="state" value={formData.state} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>ZIP Code</label>
                                <input type="text" name="zip" value={formData.zip} onChange={handleInputChange} required />
                            </div>
                            <div className="form-actions">
                                <button type="button" onClick={() => setStep(1)} className="btn btn-outline-dark">Back</button>
                                <button type="submit" className="btn btn-primary">Proceed to Payment</button>
                            </div>
                        </form>
                    </div>
                )}

                {step === 3 && (
                    <div className="payment-mockup">
                        <h2>Select Payment Method</h2>
                        <div className="payment-options">
                            <div
                                className={`payment-option ${paymentMethod === 'Razorpay' ? 'selected' : ''}`}
                                onClick={() => setPaymentMethod('Razorpay')}
                            >
                                <CreditCard size={24} />
                                <div>
                                    <p className="pay-title">Online Payment</p>
                                    <p className="pay-subtitle">Razorpay (Credit/Debit/UPI)</p>
                                </div>
                            </div>

                            <div
                                className={`payment-option ${paymentMethod === 'COD' ? 'selected' : ''}`}
                                onClick={() => setPaymentMethod('COD')}
                            >
                                <Truck size={24} />
                                <div>
                                    <p className="pay-title">Cash on Delivery</p>
                                    <p className="pay-subtitle">Pay when you receive the order</p>
                                </div>
                            </div>
                        </div>

                        <div className="order-summary-box">
                            <h3>Order Summary</h3>
                            <p>Total Items: {cartItems.reduce((acc, item) => acc + item.quantity, 0)}</p>
                            <p className="total-amount">Total Amount: ₹{calculateTotal().toLocaleString('en-IN')}</p>
                        </div>

                        <div className="form-actions">
                            <button onClick={() => setStep(2)} className="btn btn-outline-dark">Back</button>
                            <button onClick={handlePlaceOrder} className="btn btn-secondary pay-btn" disabled={orderLoading}>
                                {orderLoading ? 'Placing Order...' : 'Pay Now'}
                            </button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="order-success">
                        <CheckCircle size={80} className="success-icon" />
                        <h2>Order Placed Successfully!</h2>
                        <p>Thank you for your order. Your Order ID is #{orderId ? orderId.slice(-8).toUpperCase() : 'NEW'}.</p>
                        <p>You will receive a confirmation email shortly.</p>
                        <div className="success-actions">
                            <Link to="/catalogue" className="btn btn-primary">Continue Shopping</Link>
                            <Link to="/dashboard" className="btn btn-outline-dark">View Orders</Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
