import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicLayout from './../components/PublicLayout';
import '../styles/myorders.css';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');
    const [expandedOrder, setExpandedOrder] = useState(null);
    const currentUserId = localStorage.getItem('userId');

    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUserId) return;
        fetch(`http://127.0.0.1:8000/api/my-orders/?user_id=${currentUserId}`)
            .then(res => res.json())
            .then(data => {
                setOrders(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error retrieving orders:", err);
                setLoading(false);
            });
    }, []);

    const filterTabs = ['All', 'Processing', 'Confirmed', 'Cancelled'];

    const filteredOrders = activeTab === 'All' ? orders : orders.filter(o => o.status === activeTab);

    const toggleDetails = (orderNum) => {
        setExpandedOrder(expandedOrder === orderNum ? null : orderNum);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light-curve">
                <div className="spinner-dot-glow"></div>
            </div>
        );
    }
  return (
    <PublicLayout>
        <div className="orders-dashboard py-5">
            <div className="container">
                <div className="row mb-5 align-items-center">
                    <div className="col-md-5">
                        <h2 className="fw-extrabold text-dark tracking-tight mb-1">My Food Journeys</h2>
                        <p className="text-muted small m-0">Track, manage, and reorder your culinary experiences.</p>
                    </div>
                    
                    <div className="col-md-7 d-flex justify-content-md-end align-items-center flex-wrap gap-3 mt-3 mt-md-0">
                        <div className="pills-glass-wrapper p-1 rounded-pill bg-white shadow-sm d-flex gap-1">
                            {filterTabs.map(tab => (
                                <button key={tab} onClick={() => setActiveTab(tab)} className={`btn rounded-pill px-3 py-2 text-sm transition-all border-0 ${activeTab === tab ? 'bg-dark text-white fw-bold shadow-sm' : 'text-secondary bg-transparent'}`}>
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {filteredOrders.length === 0 && (
                    <div className="text-center py-5 bg-white rounded-4 shadow-sm border border-dashed-2">
                        <i className="bi bi-box-seam text-muted fs-1 mb-3 d-block"></i>
                        <h4 className="fw-bold text-dark">No orders found</h4>
                        <p className="text-muted px-3">It seems you don't have any orders categorized under "{activeTab}" at the moment.</p>
                    </div>
                )}

                <div className="d-flex flex-column gap-4">
                    {filteredOrders.map((order) => (
                        <div key={order.order_number} className="order-master-card border-0 shadow-sm rounded-4 bg-white overflow-hidden transition-card">
                            <div className="p-4 bg-glass-header border-bottom d-flex flex-wrap align-items-center justify-content-between gap-3">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="order-icon-square bg-dark text-white rounded-3 d-flex align-items-center justify-content-center">
                                        <i className="bi bi-receipt fs-5"></i>
                                    </div>
                                    <div>
                                        <span className="text-muted text-uppercase tracking-wider small-xs font-monospace d-block">Order Ref</span>
                                        <h6 className="fw-extrabold text-dark m-0">{order.order_number}</h6>
                                    </div>
                                </div>

                                <div className="d-flex align-items-center flex-wrap gap-4">
                                    <div>
                                        <span className="text-muted small-xs d-block text-md-end">Placed On</span>
                                        <span className="fw-bold text-secondary text-sm">{order.date}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted small-xs d-block text-md-end">Grand Total</span>
                                        <span className="fw-extrabold text-success text-md">৳{order.grand_total.toFixed(2)}</span>
                                    </div>
                                    <div>
                                        <span className={`status-badge-neon badge px-3 py-2 rounded-pill ${order.status.toLowerCase()}`}>
                                            <span className="status-dot"></span>{order.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="row align-items-center">
                                    <div className="col-lg-6 col-md-12 d-flex align-items-center gap-2 overflow-hidden items-preview-row">
                                        {order.items.map((item, idx) => (
                                            <div key={item.id} className="position-relative stack-img-container" style={{ zIndex: 10 - idx }}>
                                                <img src={item.food.image.startsWith('http') ? item.food.image : `http://127.0.0.1:8000${item.food.image}`} alt={item.food.item_name} className="avatar-img-circle rounded-circle border border-2 border-white shadow-sm object-fit-cover"/>
                                                <span className="badge bg-dark rounded-circle position-absolute bottom-0 end-0 mini-qty-bubble">
                                                    {item.quantity}
                                                </span>
                                            </div>
                                        ))}
                                        <div className="ms-2">
                                            <span className="text-dark fw-bold text-sm d-block text-truncate max-w-250">
                                                {order.items.map(i => i.food.item_name).join(', ')}
                                            </span>
                                            <span className="text-muted small-xs">{order.items.length} dynamic dish profile(s)</span>
                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-md-12 d-flex justify-content-lg-end justify-content-start gap-3 mt-3 mt-lg-0">
                                        <button onClick={() => navigate(`/track?order_number=${order.order_number}`)} className="btn btn-outline-dark rounded-3 px-4 py-2 font-sm fw-bold d-flex align-items-center gap-2 shadow-sm-hover">
                                            <i className="bi bi-geo-alt-fill text-danger animate-pulse"></i> Track Link
                                        </button>
                                        <button onClick={() => toggleDetails(order.order_number)} className={`btn rounded-3 px-4 py-2 font-sm fw-bold d-flex align-items-center gap-2 transition-all ${expandedOrder === order.order_number ? 'btn-dark' : 'btn-light-accent text-dark'}`} >
                                            <i className={`bi ${expandedOrder === order.order_number ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i> View Detail
                                        </button>
                                    </div>
                                </div>

                                {expandedOrder === order.order_number && (
                                    <div className="expanded-details-tray mt-4 pt-4 border-top animation-slide-down">
                                        <h6 className="fw-extrabold text-dark mb-3">Itemized Invoice Breakdown</h6>
                                        <div className="d-flex flex-column gap-3 mb-4">
                                            {order.items.map((item) => (
                                                <div key={item.id} className="d-flex align-items-center justify-content-between p-3 bg-light rounded-3 transition-hover-sub">
                                                    <div className="d-flex align-items-center gap-3">
                                                        <i className="bi bi-arrow-right-short text-muted"></i>
                                                        <div>
                                                            <span className="fw-bold text-dark text-sm d-block">{item.food.item_name}</span>
                                                            <span className="text-muted small-xs bg-white px-2 py-0.5 rounded border">{item.food.dietary_tags}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-end">
                                                        <span className="text-muted small d-block">{item.quantity} x ৳{item.price_at_purchase}</span>
                                                        <span className="fw-bold text-dark text-sm">৳{parseFloat(item.total_price).toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="row justify-content-end">
                                            <div className="col-md-5 col-lg-4">
                                                <div className="p-3 bg-matrix-summary rounded-4 border">
                                                    <div className="d-flex justify-content-between text-muted small mb-2">
                                                        <span>Subtotal Summary</span>
                                                        <span>৳{order.subtotal.toFixed(2)}</span>
                                                    </div>
                                                    <div className="d-flex justify-content-between text-muted small mb-2">
                                                        <span>Shipping Fee ({order.items.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                                                        <span>৳{order.shipping_charge.toFixed(2)}</span>
                                                    </div>
                                                    <div className="d-flex justify-content-between text-muted small pb-2 mb-2 border-bottom border-dashed">
                                                        <span>Payment Method</span>
                                                        <span className="text-uppercase text-dark fw-bold font-monospace">{order.payment_info?.payment_method || 'COD'}</span>
                                                    </div>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <span className="fw-bold text-dark">Total Charged</span>
                                                        <span className="fw-extrabold text-success fs-5">৳{order.grand_total.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </PublicLayout>
  )
}

export default MyOrders
