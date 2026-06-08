import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import PublicLayout from '../components/PublicLayout'

const Cart = () => {
    const navigate = useNavigate();
    const currentUserId = localStorage.getItem('userId');
    
    const [cartData, setCartData] = useState({ items: [], summary: { subtotal: 0, shipping_fee: 0, free_delivery_threshold: 500, grand_total: 0 } });
    const [loading, setLoading] = useState(true);
    const [updatingItemId, setUpdatingItemId] = useState(null);

    const fetchCartDetails = useCallback(async () => {
        if (!currentUserId) {
            setLoading(false);
            return;
        }
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/cart/', {
                headers: { 'X-User-Id': currentUserId }
            });
            setCartData(response.data);
        } catch (error) {
            toast.error("Could not fetch sync data from shopping cart service.");
        } finally {
            setLoading(false);
        }
    }, [currentUserId]);

    useEffect(() => {
        if (!currentUserId) {
            toast.info("Please log in to manage your FoodExpress dining selection.");
            navigate('/user/login');
            return;
        }
        fetchCartDetails();
    }, [currentUserId, navigate, fetchCartDetails]);

    const handleQuantityChange = async (itemId, action) => {
        setUpdatingItemId(itemId);
        try {
            await axios.post(`http://127.0.0.1:8000/api/cart/update/${itemId}/`, 
                { action }, 
                { headers: { 'X-User-Id': currentUserId } }
            );
            await fetchCartDetails();
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (error) {
            toast.error("Failed to alter selection parameters.");
        } finally {
            setUpdatingItemId(null);
        }
    };

    const handleRemoveItem = async (itemId, itemName) => {
        try {
            const response = await axios.delete(`http://127.0.0.1:8000/api/cart/remove/${itemId}/`, {
                headers: { 'X-User-Id': currentUserId }
            });
            if (response.data.success) {
                toast.success(`Removed "${itemName}" from your food collection tray.`);
                await fetchCartDetails();  // Refresh local cart totals safely
                window.dispatchEvent(new Event('cartUpdated')); // INSTANT TRIGGER: Broadcast to navbar to update the badge immediately
            }
        } catch (error) {
            toast.error("Error modifying active selection records.");
        }
    };

    const calculateProgress = () => {
        const subtotal  = cartData.summary.subtotal;
        const threshold = cartData.summary.free_delivery_threshold;
        return Math.min((subtotal / threshold) * 100, 100);
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center bg-light" style={{ minHeight: '100vh' }}>
            <div className="spinner-border text-danger" role="status" style={{ width: '3rem', height: '3rem' }}></div>
        </div>
    );
  return (
    <PublicLayout>
        <div className="min-vh-100 py-5" style={{ backgroundColor: '#FAF9F6', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <div className="container">
                <h1 className="fw-extrabold text-dark mb-4" style={{ fontWeight: 800 }}>My Dining Tray</h1>

                {cartData.items.length === 0 ? (
                    <div className="text-center bg-white border rounded-4 shadow-sm py-5 px-4 max-width-600 mx-auto mt-4">
                        <div className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-4 animate-bounce" style={{ width: '100px', height: '100px' }}>
                            <i className="bi bi-basket3 text-muted" style={{ fontSize: '42px' }}></i>
                        </div>
                        <h3 className="fw-bold text-dark mb-2">Your selection tray is totally empty</h3>
                        <p className="text-secondary max-width-400 mx-auto mb-4" style={{ fontSize: '15px' }}>
                            Looks like you haven't selected any premium chef specials yet. Head back to the explore panel to view our dishes.
                        </p>
                        <Link to="/" className="btn px-4 text-white fw-bold shadow-sm py-2.5" style={{ backgroundColor: '#E2583E', borderRadius: '10px' }}>
                            Explore Premium Foods
                        </Link>
                    </div>
                ) : (
                    <div className="row g-4 align-items-start">
                        <div className="col-12 col-lg-8">
                            <div className="d-flex flex-column gap-3">
                                {cartData.items.map((item) => {
                                    const actualPrice = item.food.discount_price ? item.food.discount_price : item.food.item_price;
                                    return (
                                        <div key={item.id} className="card border-0 shadow-sm p-3 rounded-4 bg-white position-relative overflow-hidden transition-all-hover">
                                            <div className="d-flex align-items-center flex-wrap flex-md-nowrap gap-3">
                                                <div className="rounded-3 overflow-hidden border bg-light flex-shrink-0" style={{ width: '100px', height: '100px' }}>
                                                    <img src={`http://127.0.0.1:8000${item.food.image}`} alt={item.food.item_name} className="w-100 h-100 object-fit-cover"/>
                                                </div>

                                                <div className="flex-grow-1">
                                                    <h5 className="fw-bold text-dark mb-1 m-0">{item.food.item_name}</h5>
                                                    <div className="text-muted small mb-2 d-flex align-items-center gap-2">
                                                        <span>Qn: {item.food.item_quantity}</span>
                                                    </div>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <span className="fw-bold text-dark fs-5">৳{actualPrice}</span>
                                                        {item.food.discount_price && (
                                                            <del className="text-muted small">৳{item.food.item_price}</del>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="d-flex align-items-center justify-content-between w-100 w-md-auto gap-4 mt-3 mt-md-0">
                                                    <div className="d-flex align-items-center bg-light border rounded-3 p-1" style={{ width: '120px' }}>
                                                        <button disabled={updatingItemId === item.id || item.quantity <= 1} className="btn btn-link text-decoration-none text-dark fw-bold px-2 py-0 fs-5 m-0" onClick={() => handleQuantityChange(item.id, 'decrease')}>
                                                            -
                                                        </button>

                                                        <span className="form-control text-center border-0 bg-transparent p-0 m-0 fw-bold fs-6 text-dark">
                                                            {updatingItemId === item.id ? (
                                                                <span className="spinner-border spinner-border-sm text-dark" style={{ width: '12px', height: '12px' }}></span>
                                                            ) : item.quantity}
                                                        </span>

                                                        <button disabled={updatingItemId === item.id} className="btn btn-link text-decoration-none text-dark fw-bold px-2 py-0 fs-5 m-0" onClick={() => handleQuantityChange(item.id, 'increase')}>
                                                            +
                                                        </button>
                                                    </div>

                                                    <div className="text-end" style={{ minWidth: '90px' }}>
                                                        <span className="small text-muted d-block">Subtotal</span>
                                                        <span className="fw-extrabold text-dark fs-5" style={{ fontWeight: 800 }}>৳{item.total_price}</span>
                                                    </div>

                                                    <button onClick={() => handleRemoveItem(item.id, item.food.item_name)} className="btn btn-light rounded-circle text-danger p-2 border-0 shadow-sm custom-trash-btn" title="Remove dish">
                                                        <i className="bi bi-trash-fill fs-5"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right Column: Order Pricing Summary Card */}
                        <div className="col-12 col-lg-4 position-sticky" style={{ top: '30px' }}>
                            <div className="card border-0 shadow-sm p-3 rounded-4 bg-white mb-3">
                                <div className="d-flex align-items-center gap-2 mb-2">
                                    <i className="bi bi-truck text-success fs-4"></i>
                                    <span className="small fw-semibold text-dark">
                                        {cartData.summary.subtotal >= cartData.summary.free_delivery_threshold 
                                            ? "🎉 Congratulations! You unlocked Free Delivery!" 
                                            : `Add ৳${cartData.summary.free_delivery_threshold - cartData.summary.subtotal} more to unlock Free Delivery!`}
                                    </span>
                                </div>

                                <div className="progress rounded-pill shadow-inner" style={{ height: '8px' }}>
                                    <div className={`progress-bar rounded-pill transition-all ${cartData.summary.subtotal >= cartData.summary.free_delivery_threshold ? 'bg-success' : 'bg-warning'}`} role="progressbar" style={{ width: `${calculateProgress()}%` }}></div>
                                </div>
                            </div>

                            {/* Detailed Checklist Invoice Cost Box */}
                            <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
                                <h4 className="fw-bold text-dark mb-4">Summary</h4>
                                
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="text-secondary">Basket Subtotal</span>
                                    <span className="fw-bold text-dark fs-5">৳{cartData.summary.subtotal.toFixed(2)}</span>
                                </div>
                                
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="text-secondary">Premium Delivery Fee</span>
                                    <span className={`fw-bold ${cartData.summary.shipping_fee === 0 ? 'text-success' : 'text-dark'} fs-5`}>
                                        {cartData.summary.shipping_fee === 0 ? "FREE" : `৳${cartData.summary.shipping_fee.toFixed(2)}`}
                                    </span>
                                </div>

                                <hr className="my-4 border-muted" />

                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <span className="fw-bold text-dark fs-5">Grand Total</span>
                                    <span className="fw-black text-danger fs-3" style={{ fontWeight: 900 }}>৳{cartData.summary.grand_total.toFixed(2)}</span>
                                </div>

                                <button onClick={() => navigate('/checkout')} className="btn btn-dark w-100 fw-bold border-0 text-white shadow-sm premium-action-btn" style={{ height: '54px', borderRadius: '12px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
                                    Proceed to Secure Checkout <i className="bi bi-arrow-right ms-2"></i>
                                </button>

                                <div className="text-center mt-3">
                                    <Link to="/" className="text-decoration-none small fw-bold text-secondary-hover transition-all" style={{ color: '#E2583E' }}>
                                        <i className="bi bi-arrow-left me-1"></i> Continue Adding Dishes
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .transition-all-hover { transition: transform 0.2s ease, box-shadow 0.2s ease; }
                .transition-all-hover:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.05) !important; }
                .custom-trash-btn { transition: background-color 0.2s, color 0.2s; }
                .custom-trash-btn:hover { background-color: #fee2e2 !important; color: #dc2626 !important; }
                .premium-action-btn { transition: transform 0.2s ease, box-shadow 0.2s; }
                .premium-action-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(15,23,42,0.15) !important; }
                .max-width-600 { max-width: 600px; }
                .max-width-400 { max-width: 400px; }
                .text-secondary-hover:hover { filter: brightness(0.8); }
                @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); }}
                .animate-bounce { animation: bounce 2s infinite ease-in-out; }`}
            </style>
        </div>
    </PublicLayout>
  )
}

export default Cart
