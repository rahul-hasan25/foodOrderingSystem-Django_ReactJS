import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from './../components/AdminLayout';

const AllOrders = () => {
    const [orders, setOrders] = useState([]);
    const [metrics, setMetrics] = useState({
        total_orders: 0,
        total_revenue: 0,
        completed_payments: 0,
        pending_payments: 0
    });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [updatingId, setUpdatingId] = useState(null);

    // Fetch dynamic administrative transaction rows
    const loadAdminLedgerData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/admin/all-orders/', {
                params: {
                    search: search,
                    status: statusFilter
                }
            });
            setOrders(response.data.orders);
            setMetrics(response.data.metrics);
        } catch (error) {
            console.error("Dashboard engine data extraction breakdown:", error);
            toast.error("Failed to fetch fresh transaction records from backend core server.");
        } finally {
            setLoading(false);
        }
    }, [search, statusFilter]);

    useEffect(() => {
        const delaysDebounceHandler = setTimeout(() => {
            loadAdminLedgerData();
        }, 400); // Debounce high frequency search inputs safely

        return () => clearTimeout(delaysDebounceHandler);
    }, [search, statusFilter, loadAdminLedgerData]);

    const handleStatusUpdate = async (orderId, nextStatusValue) => {
        setUpdatingId(orderId);
        try {
            await axios.patch(`http://127.0.0.1:8000/api/admin/all-orders/${orderId}/`, {
                payment_status: nextStatusValue
            });
            toast.success(`Order #${orderId} set to state [${nextStatusValue}] successfully.`);
            loadAdminLedgerData(); // Refresh values transparently
        } catch (err) {
            toast.error("Failed to alter transactional profile pipeline constraints validation status.");
        } finally {
            setUpdatingId(null);
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Completed': return 'bg-success text-white';
            case 'Pending': return 'bg-warning text-dark';
            case 'Failed': return 'bg-danger text-white';
            case 'Refunded': return 'bg-info text-dark';
            default: return 'bg-secondary text-white';
        }
    };
  return (
    <AdminLayout>
        <div className="container-fluid py-4 bg-light min-vh-100">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
            
            {/* Header Module Row */}
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                <div>
                    <h2 className="fw-bold text-dark mb-1">Administrative Order Operations Hub</h2>
                    <p className="text-muted small mb-0">Live macro system diagnostics, tracking customer choices logs metrics securely.</p>
                </div>
                <button className="btn btn-primary rounded-3 shadow-sm d-flex align-items-center gap-2" onClick={loadAdminLedgerData}>
                    <i className="bi bi-arrow-clockwise"></i> Clear Sync Refresh
                </button>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-3 p-3 bg-white transition-all-hover">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h6 className="text-uppercase text-secondary tracking-wider small fw-bold mb-1">Total Purchases</h6>
                                <h3 className="mb-0 fw-extrabold text-dark font-monospace">{metrics.total_orders}</h3>
                            </div>
                            <div className="bg-primary bg-opacity-10 p-3 rounded-3 text-primary fs-4">
                                📦
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-3 p-3 bg-white transition-all-hover">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h6 className="text-uppercase text-secondary tracking-wider small fw-bold mb-1">Gross Ledger Value</h6>
                                <h3 className="mb-0 fw-extrabold text-success font-monospace">${metrics.total_revenue.toFixed(2)}</h3>
                            </div>
                            <div className="bg-success bg-opacity-10 p-3 rounded-3 text-success fs-4">
                                💰
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-3 p-3 bg-white transition-all-hover">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h6 className="text-uppercase text-secondary tracking-wider small fw-bold mb-1">Order Completed</h6>
                                <h3 className="mb-0 fw-extrabold text-info font-monospace">{metrics.completed_payments}</h3>
                            </div>
                            <div className="bg-info bg-opacity-10 p-3 rounded-3 text-info fs-4">
                                ✅
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-3 p-3 bg-white transition-all-hover">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h6 className="text-uppercase text-secondary tracking-wider small fw-bold mb-1">Order Pending</h6>
                                <h3 className="mb-0 fw-extrabold text-warning font-monospace">{metrics.pending_payments}</h3>
                            </div>
                            <div className="bg-warning bg-opacity-10 p-3 rounded-3 text-warning fs-4">
                                ⏳
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-1 mb-4 p-3 bg-white">
                <div className="row g-3 align-items-center">
                    <div className="col-12 col-md-6 col-lg-8">
                        <div className="input-group">
                            <span className="input-group-text bg-light border-0 text-muted">🔍</span>
                            <input type="text" className="custom-placeholder form-control border-0 bg-light" placeholder="Filter records securely using order code, food name, buyer names or email indices..." value={search} onChange={(e) => setSearch(e.target.value)}/>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <select className="form-select border-0 bg-light text-secondary fw-medium" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="">All Flow Pipeline Status States</option>
                            <option value="Pending">Pending Validation Checks</option>
                            <option value="Completed">Completed Settlements</option>
                            <option value="Failed">Failed Fault Drops</option>
                            <option value="Refunded">Refunded Cashbacks</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Orders Matrix Grid Table Output Content Layout Container */}
            <div className="card border-0 shadow-sm rounded-3 overflow-hidden bg-white">
                {loading ? (
                    <div className="text-center py-5 text-secondary">
                        <div className="spinner-border spinner-border-md mb-2 text-primary" role="status"></div>
                        <p className="small italic mb-0">Synchronizing relational system tracking details matrix ledger tables...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-5">
                        <h3 className="mb-1">📦</h3>
                        <p className="text-muted small mb-0">No historical tracking metrics profiles discovered mapping active search query criteria strings.</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light border-bottom text-uppercase fs-7 tracking-wider text-secondary">
                                <tr>
                                    <th className="ps-4 py-3">Tracking Reference #</th>
                                    <th>Buyer Contacts Ledger</th>
                                    <th>Dish Specification Details</th>
                                    <th className="text-center">Count</th>
                                    <th className="text-end">Total Amount</th>
                                    <th className="text-center">Settlement Status</th>
                                    <th className="pe-4 text-end">Action controls</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id} className="transition-all-hover">
                                        <td className="ps-4 font-monospace fw-bold text-dark text-nowrap">
                                            {order.order_number || <span className="text-muted text-xs font-sans italic">Not Settled</span>}
                                        </td>
                                        <td>
                                            <div className="fw-semibold text-dark">{order.user_details?.full_name}</div>
                                            <div className="text-muted small font-monospace">{order.user_details?.email}</div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="fw-medium text-dark">{order.food_details?.item_name}</div>
                                            </div>
                                        </td>
                                        <td className="text-center font-monospace text-dark fw-medium">
                                            x{order.quantity}
                                        </td>
                                        <td className="text-end font-monospace text-success fw-bold">
                                            ${parseFloat(order.computed_total).toFixed(2)}
                                        </td>
                                        <td className="text-center">
                                            <span className={`badge rounded-pill px-3 py-2 fs-7 fw-semibold ${getStatusBadgeClass(order.payment_info?.payment_status)}`}>
                                                {order.payment_info?.payment_status || 'COD / Unpaid'}
                                            </span>
                                        </td>
                                        <td className="pe-4 text-end">
                                            <div className="d-inline-flex gap-1">
                                                <select disabled={updatingId === order.id} className="form-select form-select-sm rounded-2 border-secondary bg-light fs-7 text-dark" style={{ width: '135px' }} value={order.payment_info?.payment_status || 'Pending'} onChange={(e) => handleStatusUpdate(order.id, e.target.value)}>
                                                    <option value="Pending">Set Pending</option>
                                                    <option value="Completed">Set Completed</option>
                                                    <option value="Failed">Set Failed</option>
                                                    <option value="Refunded">Set Refunded</option>
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Micro Custom CSS Layout Styles Injection Anchor block */}
            <style>{`
                .transition-all-hover { transition: background-color 0.15s ease, transform 0.15s ease; }
                .transition-all-hover:hover { background-color: rgba(248, 249, 250, 0.85); }
                .tracking-wider { letter-spacing: 0.06em; }
                .fs-7 { font-size: 0.82rem; }
                .fw-extrabold { font-weight: 800; }
                .custom-placeholder::placeholder {color: #94a3b8 !important;opacity: 1 !important;}
            `}</style>
        </div>
    </AdminLayout>
  )
}

export default AllOrders
