import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from './../components/AdminLayout';

const DateReports = () => {
    const today = new Date().toISOString().split('T')[0];
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const [filterData, setFilterData] = useState({
        start_date : sevenDaysAgo,
        end_date   : today,
        status     : 'ALL'
    });

    const [reportResults, setReportResults] = useState([]);
    const [metrics, setMetrics] = useState({ total_orders: 0, total_revenue: 0, total_items_sold: 0 });
    const [isLoading, setIsLoading] = useState(false);

    const fetchReports = async () => {
        if (!filterData.start_date || !filterData.end_date) {
            toast.warning("Please specify both a starting point and target ending date boundary.");
            return;
        }
        if (new Date(filterData.start_date) > new Date(filterData.end_date)) {
            toast.error("Invalid range! 'From Date' cannot scale further down line than your 'To Date'.");
            return;
        }

        setIsLoading(true);
        try {
            const url = `http://127.0.0.1:8000/api/admin/reports/date-range/?start_date=${filterData.start_date}&end_date=${filterData.end_date}&status=${filterData.status}`;
            const response = await axios.get(url);
            
            if (response.data.success) {
                setReportResults(response.data.reports);
                setMetrics(response.data.metrics);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load server calculations or range database matching arrays.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilterData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        fetchReports();
    };

    const renderBadgeStatus = (statusValue) => {
        const classes = {
            'Completed': 'bg-success text-white',
            'Pending': 'bg-warning text-dark',
            'Failed': 'bg-danger text-white',
            'Refunded': 'bg-info text-dark'
        };
        return `badge rounded-pill px-3 py-2 fs-7 fw-semibold ${classes[statusValue] || 'bg-secondary text-white'}`;
    };
  return (
    <AdminLayout>
        <div className="container-fluid min-vh-100 py-4 bg-light text-dark">
            <ToastContainer position="top-right" autoClose={2500} theme="colored" />

            <div className="row mb-4">
                <div className="col">
                    <div className="d-flex align-items-center gap-2">
                        <span className="fs-2">📊</span>
                        <h2 className="fw-extrabold text-slate m-0">System Performance & Financial Ledger</h2>
                    </div>
                    <p className="text-muted ms-5">Analyze store purchases, tracking vectors, and item conversions between set dates.</p>
                </div>
            </div>

            <div className="card border-0 shadow-sm p-4 mb-4 bg-white">
                <form onSubmit={handleFormSubmit} className="row g-3 align-items-end">
                    <div className="col-lg-3 col-md-4">
                        <label className="form-label text-secondary small fw-bold uppercase tracking-wider">From Date</label>
                        <input type="date" name="start_date" className="form-control border-secondary-subtle py-2 shadow-inner" value={filterData.start_date} onChange={handleInputChange} />
                    </div>

                    <div className="col-lg-3 col-md-4">
                        <label className="form-label text-secondary small fw-bold uppercase tracking-wider">To Date</label>
                        <input type="date" name="end_date" className="form-control border-secondary-subtle py-2 shadow-inner" value={filterData.end_date} onChange={handleInputChange} />
                    </div>

                    <div className="col-lg-3 col-md-4">
                        <label className="form-label text-secondary small fw-bold uppercase tracking-wider">Payment Status</label>
                        <select name="status" className="form-select border-secondary-subtle py-2" value={filterData.status} onChange={handleInputChange}>
                            <option value="ALL">Show All Orders</option>
                            <option value="Pending">Pending Validation</option>
                            <option value="Completed">Completed Revenue</option>
                            <option value="Failed">Failed Exceptions</option>
                            <option value="Refunded">Refunded</option>
                        </select>
                    </div>

                    <div className="col-lg-3 col-md-12 d-grid">
                        <button type="submit" className="btn btn-dark py-2 fw-medium transition-transform align-middle shadow-sm" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Crunching Records...
                                </>
                            ) : (
                                <>🔍 Compile Custom Report</>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <div className="row g-4 mb-4">
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm p-4 bg-white position-relative overflow-hidden group">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="text-muted fw-semibold small text-uppercase mb-1">Total Ordered Load</h6>
                                <h2 className="fw-extrabold m-0 text-dark">{metrics.total_orders}</h2>
                            </div>
                            <div className="bg-light p-3 fs-3">📦</div>
                        </div>
                        <div className="position-absolute bottom-0 start-0 bg-primary w-100" style={{ height: '4px' }}></div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card border-0 shadow-sm p-4 bg-white position-relative overflow-hidden">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="text-muted fw-semibold small text-uppercase mb-1">Gross Yield Return</h6>
                                <h2 className="fw-extrabold m-0 text-success">${metrics.total_revenue.toFixed(2)}</h2>
                            </div>
                            <div className="bg-success-subtle p-3 fs-3 text-success">💰</div>
                        </div>
                        <div className="position-absolute bottom-0 start-0 bg-success w-100" style={{ height: '4px' }}></div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card border-0 shadow-sm p-4 bg-white position-relative overflow-hidden">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="text-muted fw-semibold small text-uppercase mb-1">Dishes Dispatched</h6>
                                <h2 className="fw-extrabold m-0 text-dark">{metrics.total_items_sold} items</h2>
                            </div>
                            <div className="bg-light p-3 fs-3">🍳</div>
                        </div>
                        <div className="position-absolute bottom-0 start-0 bg-dark w-100" style={{ height: '4px' }}></div>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                <div className="card-header bg-white border-bottom border-light py-3 px-4 d-flex justify-content-between align-items-center">
                    <h5 className="m-0 fw-bold text-slate">Tabular Ledger Streams</h5>
                    <span className="badge bg-light text-dark border font-monospace px-3 py-2">
                        Interval: {filterData.start_date} → {filterData.end_date}
                    </span>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light border-bottom text-secondary">
                            <tr>
                                <th className="ps-4 py-3">Order Number</th>
                                <th className="py-3">Date Initiated</th>
                                <th className="py-3">Customer Profile</th>
                                <th className="py-3">Dish Allocation</th>
                                <th className="py-3 text-center">Qty Ordered</th>
                                <th className="py-3 text-end">Financial Total</th>
                                <th className="pe-4 py-3 text-end">Status Token</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-5">
                                        <div className="spinner-border text-dark mb-2" role="status"></div>
                                        <p className="text-muted mb-0">Querying matching datasets from core partitions...</p>
                                    </td>
                                </tr>
                            ) : reportResults.length > 0 ? (
                                reportResults.map((item) => (
                                    <tr key={item.id} className="transition-all">
                                        <td className="ps-4">
                                            <span className="font-monospace fw-bold text-primary">{item.order_number}</span>
                                        </td>
                                        <td className="text-secondary small">
                                            {new Date(item.created_at).toLocaleString('en-US', {
                                                dateStyle: 'medium',
                                                timeStyle: 'short'
                                            })}
                                        </td>
                                        <td>
                                            <div className="fw-bold">{item.customer_name}</div>
                                        </td>
                                        <td className="fw-medium text-dark">{item.food_name}</td>
                                        <td className="text-center fw-bold font-monospace text-secondary">x{item.quantity}</td>
                                        <td className="text-end fw-extrabold text-dark font-monospace">${parseFloat(item.total_amount).toFixed(2)}</td>
                                        <td className="pe-4 text-end">
                                            <span className={renderBadgeStatus(item.payment_status)}>
                                                {item.payment_status}
                                            </span>
                                            <div className="text-muted text-uppercase font-monospace mt-1" style={{ fontSize: '10px' }}>
                                                via {item.payment_method_display}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-5 bg-light-subtle text-muted">
                                        <div className="fs-1 mb-2">📁</div>
                                        <h5>No logs discovered</h5>
                                        <p className="small mb-0">No purchases found matching your selected parameters.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </AdminLayout>
  )
}

export default DateReports
