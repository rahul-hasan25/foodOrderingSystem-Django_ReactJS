import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from './../components/AdminLayout';

const SearchOrder = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    // Modal states for targeted tracking sheets
    const [showModal, setShowModal] = useState(false);
    const [activeDetail, setActiveDetail] = useState(null);
    const [isModalLoading, setIsModalLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery || searchQuery.trim().length === 0) {
            toast.warning("Please type a product name, order number, or client tag first.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/orders/search/?search_query=${encodeURIComponent(searchQuery)}`);
            if (response.data.success) {
                setOrders(response.data.orders);
                if (response.data.orders.length === 0) {
                    toast.info("No matching historical records found.");
                } else {
                    toast.success(`Retrieved ${response.data.orders.length} related listings matching request.`);
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while scanning storage blocks.");
        } finally {
            setIsLoading(false);
        }
    };

    // Dynamic lookups matching individual unique order structural records
    const fetchOrderDetails = async (orderNumber) => {
        setIsModalLoading(true);
        setShowModal(true);
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/orders/detail/${orderNumber}/`);
            if (response.data.success) {
                setActiveDetail(response.data.detail);
            }
        } catch (error) {
            console.error(error);
            toast.error("Could not construct unified profile matrix for this order.");
            setShowModal(false);
        } finally {
            setIsModalLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        const patterns = {
            'Completed': 'bg-success-subtle text-success border-success-subtle',
            'Pending'  : 'bg-warning-subtle text-warning-emphasis border-warning-subtle',
            'Failed'   : 'bg-danger-subtle text-danger border-danger-subtle',
            'Refunded' : 'bg-info-subtle text-info border-info-subtle'
        };
        return `badge px-2.5 py-1.5 fs-8 fw-semibold border rounded-pill ${patterns[status] || 'bg-secondary text-white'}`;
    };
  return (
    <AdminLayout>
        <div className="order-search-viewport min-vh-100 py-4 small-text-base">
            <style>{`
                .small-text-base { font-size: 0.85rem !important; }
                .order-search-viewport { background-color: #f8fafc; color: #1e293b;}
                .modern-card {background: #ffffff;border: 1px solid #e2e8f0; border-radius: 0.75rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);}
                .fs-7 { font-size: 0.8rem !important; }
                .fs-8 { font-size: 0.725rem !important; }
                .table-hover-custom tbody tr { transition: all 0.2s ease;}
                .table-hover-custom tbody tr:hover { background-color: #f1f5f9 !important;cursor: pointer;}
                .search-container {background: #ffffff; border: 1px solid #e2e8f0; border-radius: 50px; padding: 6px 6px 6px 16px; transition: box-shadow 0.2s ease, border-color 0.2s ease; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);}
                .search-container:focus-within {box-shadow: 0 10px 25px -5px rgba(226, 88, 62, 0.15); border-color: #E2583E;}
                .search-input-field {border: none !important; outline: none !important; box-shadow: none !important; background: transparent !important; }
                .btn-premium-orange { background-color: #E2583E !important; color: white !important; border: none; border-radius: 50px !important; padding: 10px 28px !important; transition: background-color 0.2s ease, transform 0.1s ease;}
                .btn-premium-orange:hover { background-color: #cc4e35 !important; }
                .btn-premium-orange:active {transform: scale(0.98); }
                .custom-placeholder::placeholder {color: #94a3b8 !important;opacity: 1 !important;}
                .text-gradient { background: linear-gradient(135deg, #1e293b 0%, #475569 100%); -webkit-background-clip: text;  -webkit-text-fill-color: transparent;}`}
            </style>

            <div className="container">
                <div className="text-center mb-4">
                    <h2 className="fw-extrabold tracking-tight text-gradient mb-2 fs-2">Dynamic Audit Manifest</h2>
                    <p className="text-muted fs-7 mx-auto" style={{ maxWidth: '480px' }}>
                        Query purchase chains, verify digital receipt mappings, and trace delivery logistics instantly.
                    </p>
                </div>

                {/* Centralized Search Box */}
                <div className="row justify-content-center mb-5">
                    <div className="col-lg-8 col-md-10">
                        <form onSubmit={handleSearch} className="search-container d-flex align-items-center gap-2">
                            <span className="text-muted fs-5">🔍</span>
                            <input type="text" className="custom-placeholder form-control search-input-field flex-grow-1 py-2 fs-7 text-dark" placeholder="Scan by tracking index (ex: FEX-...), dish name, or buyer profile..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
                            <button type="submit" className="btn btn-premium-orange fs-7 fw-bold" disabled={isLoading}>
                                {isLoading ? <span className="spinner-border spinner-border-sm" /> : "Inspect"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Data Collection View Sheet */}
                <div className="row justify-content-center">
                    <div className="col-lg-12">
                        <div className="modern-card overflow-hidden">
                            <div className="bg-light border-bottom px-4 py-3.5 d-flex justify-content-between align-items-center">
                                <h6 className="m-0 fw-bold text-secondary text-uppercase tracking-wider fs-8">Matching System Log Entries</h6>
                                <span className="badge bg-secondary-subtle text-secondary-emphasis font-monospace fs-8 px-2.5 py-1.5 rounded">
                                    {orders.length} items cataloged
                                </span>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-hover-custom align-middle mb-0 text-dark">
                                    <thead className="table-light border-bottom text-muted fs-8 text-uppercase fw-semibold">
                                        <tr>
                                            <th className="ps-4 py-3">Receipt Reference</th>
                                            <th className="py-3">Date</th>
                                            <th className="py-3">Buyer Profile</th>
                                            <th className="py-3">Dish Ordered</th>
                                            <th className="py-3 text-center">Volume</th>
                                            <th className="py-3 text-end">Total Price</th>
                                            <th className="py-3 text-center">Payment Status</th>
                                            <th className="pe-4 py-3 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="fs-7 border-top-0">
                                        {orders.length > 0 ? (
                                            orders.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="ps-4 font-monospace fw-bold text-dark">{item.order_number}</td>
                                                    <td className="text-secondary fs-8">{new Date(item.created_at).toLocaleDateString()}</td>
                                                    <td className="fw-semibold">{item.customer_name}</td>
                                                    <td className="text-truncate text-secondary" style={{ maxWidth: '160px' }}>{item.product_name}</td>
                                                    <td className="text-center font-monospace fw-medium">{item.quantity}</td>
                                                    <td className="text-end fw-bold font-monospace">${parseFloat(item.total_amount).toFixed(2)}</td>
                                                    <td className="text-center">
                                                        <span className={getStatusStyle(item.payment_status)}>{item.payment_status}</span>
                                                    </td>
                                                    <td className="pe-4 text-center">
                                                        <button 
                                                            onClick={() => fetchOrderDetails(item.order_number)}
                                                            className="btn btn-sm btn-light border py-1 px-2.5 fs-8 rounded-2 fw-semibold shadow-sm"
                                                        >
                                                            Inspect Details
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="8" className="text-center py-5 text-muted bg-white">
                                                    <div className="fs-1 mb-3">📋</div>
                                                    <p className="mb-1 fw-bold fs-6 text-dark">No Active Queries Discovered</p>
                                                    <p className="fs-8 text-secondary mb-0">Provide lookup parameters above to inspect operational registries.</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Deep Audit Modal Panel Container */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered className="small-text-base">
                <Modal.Header closeButton className="border-bottom-0 pt-4 px-4">
                    <Modal.Title className="fs-6 m-0 fw-bold text-dark text-uppercase tracking-wider">
                        🧾 Full File Audit Grid — <span className="font-monospace text-primary">{activeDetail?.order_number || 'Loading...'}</span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4 pt-2">
                    {isModalLoading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status"></div>
                            <p className="mt-3 text-muted fs-7 fw-medium">Decompressing operational arrays...</p>
                        </div>
                    ) : activeDetail ? (
                        <div className="row g-3">
                            <div className="col-12">
                                <div className="p-3 border rounded-3 bg-light d-flex align-items-center gap-3">
                                    <div className="bg-white border rounded-circle d-flex align-items-center justify-content-center shadow-sm fs-3" style={{ width: '54px', height: '54px' }}>🍔</div>
                                    <div>
                                        <h6 className="m-0 fw-bold text-dark fs-7">{activeDetail.product_name}</h6>
                                        <p className="text-muted fs-8 mb-0 mt-0.5">
                                            Calculated Base Allocation: <span className="font-monospace fw-semibold">${parseFloat(activeDetail.base_unit_price).toFixed(2)}</span> × {activeDetail.quantity} Units
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="p-3 border rounded-3 bg-white h-100">
                                    <h6 className="text-secondary border-bottom pb-2 mb-2.5 fw-bold fs-8 text-uppercase tracking-wider">Account Parameters</h6>
                                    <p className="mb-1.5 text-dark"><strong className="text-muted me-1 fs-8 text-uppercase">Name:</strong> {activeDetail.customer_name}</p>
                                    <p className="mb-1.5 text-dark"><strong className="text-muted me-1 fs-8 text-uppercase">Email:</strong> {activeDetail.customer_email}</p>
                                    <p className="mb-0 text-dark"><strong className="text-muted me-1 fs-8 text-uppercase">Contact:</strong> +{activeDetail.customer_mobile}</p>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="p-3 border rounded-3 bg-white h-100">
                                    <h6 className="text-secondary border-bottom pb-2 mb-2.5 fw-bold fs-8 text-uppercase tracking-wider">Delivery Target Profile</h6>
                                    {activeDetail.shipping_address ? (
                                        <>
                                            <p className="mb-1.5 text-dark"><strong className="text-muted me-1 fs-8 text-uppercase">Recipient:</strong> {activeDetail.shipping_address.contact_name} ({activeDetail.shipping_address.contact_phone})</p>
                                            <p className="mb-1.5 text-dark text-truncate"><strong className="text-muted me-1 fs-8 text-uppercase">Address:</strong> {activeDetail.shipping_address.street}, {activeDetail.shipping_address.area}, {activeDetail.shipping_address.city}</p>
                                            <p className="mb-0 text-muted fst-italic fs-8"><strong className="text-muted me-1 text-uppercase">Landmark:</strong> {activeDetail.shipping_address.landmark}</p>
                                        </>
                                    ) : (
                                        <p className="text-muted fs-8 mb-0">No custom address configurations matched this checkout sequence.</p>
                                    )}
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="p-3 border rounded-3 bg-white h-100">
                                    <h6 className="text-secondary border-bottom pb-2 mb-2.5 fw-bold fs-8 text-uppercase tracking-wider">Transactional Context</h6>
                                    <p className="mb-1.5 text-dark"><strong className="text-muted me-1 fs-8 text-uppercase">Method:</strong> {activeDetail.payment_info.method}</p>
                                    <p className="mb-2 text-dark"><strong className="text-muted me-1 fs-8 text-uppercase">Ref ID:</strong> <span className="font-monospace text-primary fw-semibold">{activeDetail.payment_info.transaction_id}</span></p>
                                    <p className="mb-0 d-flex align-items-center gap-2 text-dark">
                                        <strong className="text-muted fs-8 text-uppercase">Status:</strong> <span className={getStatusStyle(activeDetail.payment_info.status)}>{activeDetail.payment_info.status}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="p-3 border rounded-3 bg-white h-100">
                                    <h6 className="text-secondary border-bottom pb-2 mb-2.5 fw-bold fs-8 text-uppercase tracking-wider">Accounting Ledger</h6>
                                    <div className="d-flex justify-content-between fs-8 text-secondary mb-1.5">
                                        <span>Subtotal Net Matrix</span>
                                        <span className="font-monospace fw-medium">${(activeDetail.base_unit_price * activeDetail.quantity).toFixed(2)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between fs-8 text-secondary mb-2">
                                        <span>Dispatched Shipping Fee</span>
                                        <span className="font-monospace fw-medium">${parseFloat(activeDetail.shipping_charge).toFixed(2)}</span>
                                    </div>
                                    <hr className="my-2" />
                                    <div className="d-flex justify-content-between text-dark fw-bold fs-7 pt-0.5">
                                        <span>Total Price</span>
                                        <span className="font-monospace text-success fs-6">${parseFloat(activeDetail.total_amount).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-center text-danger py-4 font-semibold">Failed to process core file structural arrays.</p>
                    )}
                </Modal.Body>
                <Modal.Footer className="border-top-0 pb-4 pe-4">
                    <Button variant="light" size="sm" className="fs-8 px-3 py-1.5 border fw-semibold rounded-2 shadow-sm" onClick={() => setShowModal(false)}>
                        Close Log Screen
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    </AdminLayout>
  )
}

export default SearchOrder
