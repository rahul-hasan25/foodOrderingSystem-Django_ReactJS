import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Button, Spinner, Badge, Table } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import PublicLayout from './../components/PublicLayout';

const TrackOrder = () => {
    const [searchToken, setSearchToken] = useState('');
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleTrackingSearch = async (e) => {
        if (e) e.preventDefault();
        
        const validatedToken = searchToken.trim().toUpperCase();
        if (!validatedToken) {
            toast.warn("Please enter a valid tracking key index.");
            return;
        }

        setLoading(true);
        setOrderData(null);
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/order/track/?order_number=${encodeURIComponent(validatedToken)}`);
            setOrderData(response.data);
            toast.success("Order ledger sequence localized successfully.");
        } catch (error) {
            if (error.response && error.response.status === 404) {
                toast.error("Invalid Order Token identifier reference.");
            } else {
                toast.error("Database tracking lookup timeout. Please retry.");
            }
        } finally {
            setLoading(false);
        }
    };

    const statusSteps = [
        { key: 'Confirmed', label: 'Order Confirmed', icon: 'bi-check-circle-fill', desc: 'Kitchen accepted billing' },
        { key: 'Preparing', label: 'Food Being Prepared', icon: 'bi-egg-fried', desc: 'Chef assembling ingredients' },
        { key: 'Pickup', label: 'Food Pickup', icon: 'bi-truck', desc: 'Rider assigning packages' },
        { key: 'Delivered', label: 'Food Delivered', icon: 'bi-bag-check-fill', desc: 'Safely dropped at portal' }
    ];

    const getStepStatusIndex = (currentStatus) => {
        if (currentStatus === 'New' || currentStatus === 'Confirmed') return 0;
        if (currentStatus === 'Preparing') return 1;
        if (currentStatus === 'Pickup') return 2;
        if (currentStatus === 'Delivered') return 3;
        return -1;
    };

    const targetStepIndex = orderData ? getStepStatusIndex(orderData.status) : -1;

    const BACKEND_BASE_URL = "http://127.0.0.1:8000";
  return (
    <PublicLayout>
        <div className="style-scope-order-tracking min-vh-100 pb-5">
            <ToastContainer position="top-right" autoClose={2000} theme="dark" hideProgressBar />

            <div className="tracking-hero-strip text-center text-white py-4 px-3 mb-4">
                <Badge bg="info" className="text-uppercase font-monospace tracking-wider mb-2 fs-xxs px-2.5 py-1 text-dark fw-bold">
                    Real-time Dispatch Desk
                </Badge>
                <h1 className="fw-black text-white tracking-tight fs-4 m-0">FoodExpress Live Tracking</h1>
                <p className="text-white-50 fs-xs m-0 mt-1 max-w-450 mx-auto">
                    Verify route progress milestones, inspect payment statuses, and review dish details directly.
                </p>

                <Form onSubmit={handleTrackingSearch} className="max-w-450 mx-auto mt-3.5 px-2">
                    <div className="d-flex align-items-center bg-white rounded-3 p-1 shadow-sm border">
                        <i className="bi bi-hash text-muted ps-2 fs-xs"></i>
                        <Form.Control type="text" placeholder="Enter Order Number (ex: FEX-3A2B1C9D)" className="custom-placeholder border-0 shadow-none fs-xs bg-transparent text-dark py-1.5 px-2" value={searchToken} onChange={(e) => setSearchToken(e.target.value)}/>
                        <Button type="submit" variant="dark" size="sm" className="fs-xxs font-monospace rounded-2 px-3 tracking-wide" disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : "TRACK"}
                        </Button>
                    </div>
                </Form>
            </div>

            <Container className="px-3">
                {!orderData && !loading && (
                    <div className="text-center py-5 border-dashed rounded-3 bg-white shadow-xs max-w-600 mx-auto">
                        <div className="radar-pulse-icon mx-auto mb-3 d-flex align-items-center justify-content-center bg-light text-secondary rounded-circle">
                            <i className="bi bi-radar fs-2"></i>
                        </div>
                        <h5 className="fw-bold fs-xs text-dark text-uppercase m-0 tracking-wide">Awaiting Tracking Token</h5>
                        <p className="text-muted fs-xxs mt-1 mb-0 max-w-320 mx-auto">
                            Input your alpha-numeric security order code key into the query engine above to view your real-time tracking dashboard layout mapping layers.
                        </p>
                    </div>
                )}

                {orderData && (
                    <Row className="g-4 max-w-1000 mx-auto animate-tracking-fade">
                        
                        {/* LEFT ELEMENT: Live Timeline Block Node Deck */}
                        <Col xs={12} lg={7}>
                            <Card className="border-0 shadow-sm rounded-3 bg-white p-3 mb-3">
                                <div className="d-flex align-items-center justify-content-between mb-4 border-bottom border-light pb-2">
                                    <div>
                                        <span className="text-secondary text-uppercase tracking-wider font-monospace fs-xxs d-block">ACTIVE TRACKING FOR</span>
                                        <h2 className="fw-extrabold text-slate-900 font-monospace fs-xs m-0">{orderData.order_number}</h2>
                                    </div>
                                    <div className="text-end">
                                        {orderData.status === 'Cancelled' ? (
                                            <Badge bg="danger" className="text-uppercase font-monospace tracking-wide px-2.5 py-1 fs-xxs rounded-1">❌ Aborted/Cancelled</Badge>
                                        ) : (
                                            <Badge bg="success" className="text-uppercase font-monospace tracking-wide px-2.5 py-1 fs-xxs rounded-1 animate-pulse">⚡ Live Syncing</Badge>
                                        )}
                                    </div>
                                </div>

                                {orderData.status === 'Cancelled' ? (
                                    <div className="alert alert-danger-custom p-3 rounded-2 text-center my-2">
                                        <i className="bi bi-exclamation-octagon-fill fs-4 d-block mb-1"></i>
                                        <h6 className="fw-bold fs-xs m-0 text-uppercase">Order Lifecycle Aborted</h6>
                                        <p className="fs-xxs m-0 mt-1 text-secondary">This ticket has been cancelled. Please submit a new service cart validation structure or communicate with support coordinates.</p>
                                    </div>
                                ) : (
                                    <div className="timeline-ladder-structure position-relative py-2 ps-2">
                                        {statusSteps.map((step, index) => {
                                            const isDone = index <= targetStepIndex;
                                            const isCurrent = index === targetStepIndex;
                                            
                                            return (
                                                <div key={index} className={`timeline-ladder-node d-flex gap-3 position-relative pb-4 ${isDone ? 'node-passed' : ''} ${isCurrent ? 'node-current' : ''}`}>
                                                    <div className="node-icon-bubble d-flex align-items-center justify-content-center flex-shrink-0 z-index-2 shadow-xs">
                                                        <i className={`bi ${step.icon}`}></i>
                                                    </div>
                                                    <div className="node-content-text pt-0.5">
                                                        <h4 className="fs-xs fw-bold text-slate-900 m-0 tracking-tight">{step.label}</h4>
                                                        <p className="text-muted fs-xxs m-0">{step.desc}</p>
                                                        {isCurrent && (
                                                            <span className="current-micro-pulse-pill text-uppercase font-monospace mt-1 d-inline-block">In Progress</span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </Card>

                            {orderData.status !== 'Cancelled' && (
                                <Card className="border-0 shadow-sm rounded-3 estimate-highlight-card text-white p-3">
                                    <Row className="align-items-center g-2 text-center text-sm-start">
                                        <Col xs={12} sm={2} className="text-center">
                                            <div className="bg-white-alpha-10 rounded-circle text-center d-inline-flex p-2 fs-3 mb-1 mb-sm-0">
                                                ⏱️
                                            </div>
                                        </Col>
                                        <Col xs={12} sm={6}>
                                            <h5 className="fw-bold fs-xs m-0 text-uppercase tracking-wide">Target Fulfillment Index</h5>
                                            <p className="m-0 text-white-50 fs-xxs mt-0.5">Calculated preparation velocity aggregate based on active route metrics.</p>
                                        </Col>
                                        <Col xs={12} sm={4} className="text-sm-end">
                                            <div className="font-monospace fw-black tracking-tighter fs-3 text-warning">
                                                {orderData.status === 'Delivered' ? "ARRIVED" : `~${orderData.food_details?.preparation_time || 20} MIN`}
                                            </div>
                                        </Col>
                                    </Row>
                                </Card>
                            )}
                        </Col>

                        {/* RIGHT ELEMENT: Itemized Receipt History & Address Mapping Profile Card */}
                        <Col xs={12} lg={5}>
                            <Card className="border-0 shadow-sm rounded-3 bg-white p-3 mb-4">
                                <div className="mb-2.5 pb-1.5 border-bottom border-light">
                                    <h3 className="fw-bold fs-xs text-slate-900 m-0 text-uppercase tracking-wider">Itemized Receipt</h3>
                                    <span className="text-muted fs-xxs">Verified summary of secure checkout data records.</span>
                                </div>
                                
                                <div className="d-flex align-items-center gap-2.5 py-2.5 border-bottom border-light">
                                    <div className="receipt-thumb-wrapper flex-shrink-0 bg-light rounded overflow-hidden">
                                        <img src={orderData.food_details?.image ? (orderData.food_details.image.startsWith('http') ? orderData.food_details.image : `${BACKEND_BASE_URL}${orderData.food_details.image}`) : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150"} alt="dish particulars" className="w-100 h-100 object-fit-cover"/>
                                    </div>

                                    <div className="text-truncate flex-grow-1">
                                        <h4 className="fs-xs fw-bold text-slate-900 m-0 text-truncate">{orderData.food_details?.item_name || "Food Item Bundle"}</h4>
                                        <span className="text-muted font-monospace fs-xxs">{orderData.food_details?.item_quantity || "Standard serving"}</span>
                                    </div>

                                    <div className="text-end font-monospace flex-shrink-0">
                                        <span className="fs-xxs text-secondary d-block">Qty: {orderData.quantity}</span>
                                        <span className="fs-xs fw-bold text-slate-900">${Number(orderData.price_at_purchase).toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="pt-2 font-monospace fs-xxs text-slate-700">
                                    <div className="d-flex justify-content-between mb-1">
                                        <span>Subtotal Balance</span>
                                        <span>${(Number(orderData.price_at_purchase) * orderData.quantity).toFixed(2)}</span>
                                    </div>

                                    <div className="d-flex justify-content-between mb-1">
                                        <span>Platform Service Levy</span>
                                        <span className="text-emerald">FREE</span>
                                    </div>

                                    <div className="d-flex justify-content-between pt-1.5 border-top border-dashed fw-bold fs-xs text-slate-900">
                                        <span className="text-uppercase tracking-wider">Total Price</span>
                                        <span>${Number(orderData.computed_bill_total).toFixed(2)}</span>
                                    </div>
                                </div>
                            </Card>

                            {/* Delivery Location */}
                            {orderData.delivery_address && (
                                <Card className="border-0 shadow-sm rounded-3 bg-white p-3 mb-4">
                                    <div className="mb-2.5 pb-1.5 border-bottom border-light">
                                        <h3 className="fw-bold fs-xs text-slate-900 m-0 text-uppercase tracking-wider">Logistics Routing</h3>
                                        <span className="text-muted fs-xxs">Delivery drop coordinates lock records.</span>
                                    </div>
                                    <div className="fs-xxs text-slate-700">
                                        <div className="mb-2">
                                            <span className="text-secondary d-block font-monospace text-uppercase fs-3xxs">Consignee Person Particulars</span>
                                            <strong className="text-slate-900 fs-xs">{orderData.delivery_address.contact_person_name}</strong>
                                            <span className="d-block font-monospace text-muted">{orderData.delivery_address.contact_person_phone}</span>
                                        </div>
                                        <div>
                                            <span className="text-secondary d-block font-monospace text-uppercase fs-3xxs">Target Address Mapping</span>
                                            <p className="m-0 text-slate-900 fw-medium">
                                                {orderData.delivery_address.street_address}, {orderData.delivery_address.area_or_neighborhood}, {orderData.delivery_address.city_or_division}
                                            </p>
                                            {orderData.delivery_address.delivery_landmark && (
                                                <span className="italic mt-1 d-block text-secondary text-truncate max-w-350">📍 Landmark: {orderData.delivery_address.delivery_landmark}</span>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            )}

                            {orderData.payment_details && (
                                <Card className="border-0 shadow-sm rounded-3 bg-white p-3 border-start-premium">
                                    <div className="d-flex align-items-center justify-content-between font-monospace fs-xxs">
                                        <div>
                                            <span className="text-secondary text-uppercase fs-3xxs d-block">Transaction Engine Link</span>
                                            <strong className="text-slate-900 text-uppercase">{orderData.payment_details.payment_method_display} Ledger</strong>
                                            <span className="d-block text-muted text-truncate max-w-180">ID: {orderData.payment_details.transaction_id || "N/A"}</span>
                                        </div>
                                        <div className="text-end">
                                            <Badge bg={orderData.payment_details.payment_status_display === 'Completed' ? 'success' : 'warning'} className="text-uppercase tracking-wider rounded-1 fs-3xxs font-monospace">
                                                {orderData.payment_details.payment_status_display}
                                            </Badge>
                                        </div>
                                    </div>
                                </Card>
                            )}
                        </Col>

                    </Row>
                )}
            </Container>

            <style>{`
                .style-scope-order-tracking {background-color: #f8fafc !important; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important; letter-spacing: -0.012em;}
                .fs-xs { font-size: 0.825rem !important; }
                .fs-xxs { font-size: 0.72rem !important; }
                .fs-3xxs { font-size: 0.62rem !important; letter-spacing: 0.06em; font-weight: 700; }
                .text-slate-900 { color: #0f172a !important; }
                .text-slate-700 { color: #334155 !important; }
                .text-emerald { color: #059669 !important; }
                .max-w-450 { max-width: 450px; }
                .max-w-600 { max-width: 600px; }
                .max-w-1000 { max-width: 1000px; }
                .max-w-320 { max-width: 320px; }
                .max-w-350 { max-width: 350px; }
                .max-w-180 { max-width: 180px; }

                .tracking-hero-strip {background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);}
                .radar-pulse-icon {width: 64px;height: 64px;}
                .border-dashed { border: 2px dashed #cbd5e1 !important; }

                .timeline-ladder-structure::before { content: ''; position: absolute; top: 12px; bottom: 12px; left: 17px; width: 2px; background-color: #e2e8f0; z-index: 1;}
                .timeline-ladder-node {transition: opacity 0.2s ease;}
                .node-icon-bubble { width: 22px; height: 22px; border-radius: 50%; background-color: #fff; border: 2px solid #cbd5e1;color: #94a3b8;font-size: 10px;}
                
                .node-passed .node-icon-bubble {background-color: #0f172a !important; border-color: #0f172a !important; color: #fff !important;}
                .node-current .node-icon-bubble { background-color: #3b82f6 !important; border-color: #3b82f6 !important; color: #fff !important; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2) !important;}
                .node-passed::before { content: ''; position: absolute; top: 22px; bottom: 0;left: 17px; width: 2px; background-color: #0f172a; z-index: 1;}
                .timeline-ladder-node:last-child::before { display: none !important; }

                .current-micro-pulse-pill {font-size: 0.6rem; background-color: #eff6ff; color: #2563eb; padding: 1px 6px; border-radius: 4px; font-weight: 700; letter-spacing: 0.02em;}
                
                .estimate-highlight-card {background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);}
                .bg-white-alpha-10 { background-color: rgba(255, 255, 255, 0.08); }
                .receipt-thumb-wrapper { width: 44px; height: 44px; }
                .border-start-premium { border-left: 3px solid #10b981 !important; }
                .alert-danger-custom { background-color: #fef2f2; border: 1px solid #fee2e2; color: #991b1b; }

                @keyframes fadeInSlideUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); }}
                .animate-tracking-fade { animation: fadeInSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
                .custom-placeholder::placeholder {color: #94a3b8 !important;opacity: 1 !important;}
                
                @keyframes pulseFlicker { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; }}
                .animate-pulse { animation: pulseFlicker 2s infinite ease-in-out; }`}
            </style>
        </div>
    </PublicLayout>
  )
}

export default TrackOrder
