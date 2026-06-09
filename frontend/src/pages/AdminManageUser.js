import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import AdminLayout from './../components/AdminLayout';

const AdminManageUser = () => {
    const [users, setUsers] = useState([]);
    const [metrics, setMetrics] = useState({ total_users: 0, filtered_users: 0 });
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/admin/users/?search=${encodeURIComponent(searchQuery)}`);
            setUsers(response.data.users);
            setMetrics(response.data.metrics);
        } catch (error) {
            toast.error("Failed to fetch registered structural profile parameters.");
        } finally {
            setLoading(false);
        }
    }, [searchQuery]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchUsers();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, fetchUsers]);

    const handleDeleteUser = async (userId, userName) => {
        if (window.confirm(`Are you completely certain you want to purge profile structural mapping rules for "${userName}"?`)) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/admin/users/${userId}/delete/`);
                toast.success("Account profile deleted safely.");
                if (selectedUser?.id === userId) setSelectedUser(null);
                fetchUsers();
            } catch (error) {
                toast.error("An error occurred during secure verification erasure.");
            }
        }
    };
  return (
    <AdminLayout>
        <div className="container-fluid py-4 min-vh-100 style-scope-dashboard">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <h2 className="fw-bold tracking-tight text-slate-900 m-0 fs-5">System Workspace Control</h2>
                    <p className="text-muted m-0 small-text">Monitor system consumer states, lookup database addresses, and handle profile constraints.</p>
                </div>
                <button className="btn btn-dark btn-sm d-flex align-items-center gap-2 rounded-2 shadow-sm fs-xs" onClick={fetchUsers}>
                    <i className="bi bi-arrow-clockwise"></i> Clear Sync Cache
                </button>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-12 col-md-4">
                    <div className="card border-0 p-3 shadow-sm rounded-3 bg-white h-100 d-flex flex-row align-items-center justify-content-between">
                        <div>
                            <span className="text-uppercase text-secondary tracking-wider fs-xs d-block mb-1">Total Verified Accounts</span>
                            <h3 className="m-0 fw-extrabold text-slate-900 fs-4">{metrics.total_users}</h3>
                        </div>
                        <div className="icon-wrapper bg-blue-light text-blue rounded-3 p-2 d-flex align-items-center justify-content-center">
                            <i className="bi bi-people-fill fs-5"></i>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-4">
                    <div className="card border-0 p-3 shadow-sm rounded-3 bg-white h-100 d-flex flex-row align-items-center justify-content-between">
                        <div>
                            <span className="text-uppercase text-secondary tracking-wider fs-xs d-block mb-1">Filtered Query Matches</span>
                            <h3 className="m-0 fw-extrabold text-slate-900 fs-4">{metrics.filtered_users}</h3>
                        </div>
                        <div className="icon-wrapper bg-emerald-light text-emerald rounded-3 p-2 d-flex align-items-center justify-content-center">
                            <i className="bi bi-funnel-fill fs-5"></i>
                        </div>
                    </div>
                </div>
                
                <div className="col-12 col-md-4">
                    <div className="card border-0 p-3 shadow-sm rounded-3 bg-white h-100 d-flex flex-row align-items-center justify-content-between">
                        <div>
                            <span className="text-uppercase text-secondary tracking-wider fs-xs d-block mb-1">Active View Status Matrix</span>
                            <span className={`badge border rounded-pill mt-2 fs-xxs px-2 py-1 ${searchQuery ? 'bg-warning-light text-warning border-warning' : 'bg-success-light text-success border-success'}`}>
                                {searchQuery ? 'Fuzzy Filter Active' : 'Displaying Unfiltered Entries'}
                            </span>
                        </div>
                        <div className="icon-wrapper bg-amber-light text-amber rounded-3 p-2 d-flex align-items-center justify-content-center">
                            <i className="bi bi-cpu-fill fs-5"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                <div className={selectedUser ? "col-12 col-lg-8" : "col-12"}>
                    <div className="card border-0 shadow-sm rounded-3 bg-white overflow-hidden">
                        <div className="p-3 border-bottom bg-light d-flex align-items-center justify-content-between flex-wrap gap-2">
                            <div className="position-relative flex-grow-1 max-width-search">
                                <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary fs-xs"></i>
                                <input type="text" className="custom-placeholder form-control form-control-sm ps-5 border-1 rounded-2 shadow-inner fs-xs" placeholder="Filter profiles by unique text keys, email handles, contact variables..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
                                {searchQuery && (
                                    <button className="btn position-absolute top-50 end-0 translate-middle-y me-2 p-0 border-0" onClick={() => setSearchQuery('')}>
                                        <i className="bi bi-x-circle-fill text-muted fs-xs"></i>
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="table-responsive text-nowrap">
                            <table className="table table-hover align-middle mb-0 text-start">
                                <thead className="bg-slate-50 border-bottom text-uppercase tracking-wider text-secondary fs-xxs">
                                    <tr>
                                        <th className="py-3 px-4">User Code</th>
                                        <th className="py-3">User Name</th>
                                        <th className="py-3">Email Address</th>
                                        <th className="py-3">Mobile Number</th>
                                        <th className="py-3">Registration Date</th>
                                        <th className="py-3 text-center px-4">Management Tasks</th>
                                    </tr>
                                </thead>
                                <tbody className="fs-xs text-slate-700 border-0">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="6" className="text-center py-5">
                                                <div className="spinner-border spinner-border-sm text-secondary me-2" role="status"></div>
                                                <span className="text-muted italic fs-xs">Syncing structural parameters from database repository...</span>
                                            </td>
                                        </tr>
                                    ) : users.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="text-center py-5 text-muted small-text">
                                                <i className="bi bi-inbox fs-3 d-block text-secondary mb-2"></i> No active consumer identities matching specified filter properties were detected.
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map((user) => (
                                            <tr key={user.id} className={selectedUser?.id === user.id ? "table-active-premium border-left-indicator" : ""}>
                                                <td className="px-4 text-secondary font-monospace fs-xxs fw-medium">#FEX-USER-00{user.id}</td>
                                                <td>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className="avatar-micro rounded-circle text-white d-flex align-items-center justify-content-center fw-bold text-uppercase fs-xxs">
                                                            {user.first_name[0]}{user.last_name[0]}
                                                        </div>
                                                        <span className="fw-semibold text-slate-900">{user.first_name} {user.last_name}</span>
                                                    </div>
                                                </td>
                                                <td><span className="text-lowercase">{user.email}</span></td>
                                                <td className="font-monospace text-secondary">{user.mobile}</td>
                                                <td className="text-muted fs-xxs">{new Date(user.reg_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                                                <td className="text-center px-4">
                                                    <div className="d-flex align-items-center justify-content-center gap-2">
                                                        <button className="btn btn-light border btn-xs d-flex align-items-center gap-1 hover-premium rounded-2 fs-xxs py-1 px-2" onClick={() => setSelectedUser(user)}>
                                                            <i className="bi bi-eye-fill"></i> Inspect
                                                        </button>

                                                        <button className="btn btn-outline-danger btn-xs d-flex align-items-center gap-1 rounded-2 fs-xxs py-1 px-2" onClick={() => handleDeleteUser(user.id, `${user.first_name} ${user.last_name}`)}>
                                                            <i className="bi bi-trash3-fill"></i> Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {selectedUser && (
                    <div className="col-12 col-lg-4 animate-panel">
                        <div className="card border-0 shadow-sm rounded-3 bg-white p-4 sticky-sidebar position-relative overflow-hidden">
                            <div className="decorative-top-accent bg-dark position-absolute top-0 start-0 end-0"></div>
                            
                            <div className="d-flex align-items-center justify-content-between pb-3 border-bottom mb-3 position-relative z-index-1">
                                <span className="text-uppercase text-secondary font-monospace tracking-widest fs-xxs fw-bold">Deep Inspection Core Drawer</span>
                                <button className="btn-close fs-xxs bg-light border p-2 rounded-circle shadow-sm" aria-label="Close" onClick={() => setSelectedUser(null)}></button>
                            </div>

                            <div className="text-center my-3">
                                <div className="avatar-grand rounded-circle mx-auto mb-2 text-white d-flex align-items-center justify-content-center fw-extrabold text-uppercase shadow">
                                    {selectedUser.first_name[0]}{selectedUser.last_name[0]}
                                </div>
                                <h4 className="fw-bold m-0 text-slate-900 fs-6">{selectedUser.first_name} {selectedUser.last_name}</h4>
                                <span className="badge bg-light text-secondary border font-monospace mt-1 fs-xxs rounded-1 px-2">UUID ID: {selectedUser.id}</span>
                            </div>

                            <div className="row g-2 text-center mb-4">
                                <div className="col-6">
                                    <div className="p-2 border rounded-2 bg-slate-50 shadow-inner">
                                        <span className="d-block text-muted text-uppercase tracking-wider fs-xxs mb-1">Volume Rules</span>
                                        <span className="fw-bold text-slate-800 fs-xs font-monospace">{selectedUser.total_orders_count} Placed Orders</span>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="p-2 border rounded-2 bg-emerald-light-alpha shadow-inner">
                                        <span className="d-block text-emerald text-uppercase tracking-wider fs-xxs mb-1">Total Ledger Spent</span>
                                        <span className="fw-extrabold text-emerald fs-xs font-monospace">${Number(selectedUser.total_spent).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h6 className="section-title text-uppercase text-secondary tracking-widest fs-xxs mb-2 fw-semibold">Communication Endpoints</h6>
                                <div className="p-3 bg-light rounded-3 border d-flex flex-column gap-2">
                                    <div className="d-flex align-items-center justify-content-between border-bottom pb-2">
                                        <span className="text-muted fs-xxs">Secure Handle Link:</span>
                                        <span className="text-slate-900 fs-xs text-end fw-medium max-w-text-trunc font-monospace">{selectedUser.email}</span>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between pt-1">
                                        <span className="text-muted fs-xxs">Routing Line phone:</span>
                                        <span className="text-slate-900 fs-xs fw-semibold font-monospace">{selectedUser.mobile}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h6 className="section-title text-uppercase text-secondary tracking-widest fs-xxs mb-2 fw-semibold">Saved Tracking Profiles ({selectedUser.saved_addresses.length})</h6>
                                <div className="d-flex flex-column gap-2 max-height-addresses overflow-y-auto">
                                    {selectedUser.saved_addresses.length === 0 ? (
                                        <p className="text-center text-muted italic my-3 fs-xxs border p-3 rounded-3 border-dashed">No tracking endpoints mapped for this registered customer profile.</p>
                                    ) : (
                                        selectedUser.saved_addresses.map((addr) => (
                                            <div key={addr.id} className={`p-2 border rounded-3 position-relative transition-all shadow-xs ${addr.is_default ? 'bg-amber-light-alpha border-amber-light' : 'bg-white'}`}>
                                                <div className="d-flex align-items-center justify-content-between mb-1">
                                                    <span className={`badge px-2 py-0.5 rounded font-monospace tracking-wide fs-xxs ${addr.address_tag === 'HOME' ? 'bg-primary text-white' : addr.address_tag === 'OFFICE' ? 'bg-info text-white' : 'bg-secondary text-white'}`}>
                                                        {addr.address_tag}
                                                    </span>
                                                    {addr.is_default && <span className="text-warning fw-bold font-monospace fs-xxs">★ Default Pin</span>}
                                                </div>
                                                <p className="m-0 text-slate-800 fw-medium fs-xxs text-truncate">{addr.street_address}, {addr.area_or_neighborhood}, {addr.city_or_division}</p>
                                                <p className="m-0 text-muted fs-xxs mt-1"><i className="bi bi-person-badge text-secondary me-1"></i> {addr.contact_person_name} ({addr.contact_person_phone})</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .style-scope-dashboard {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
                    background-color: #f8fafc !important;
                    letter-spacing: -0.011em;
                }
                .fs-xs { font-size: 0.8rem !important; }
                .fs-xxs { font-size: 0.72rem !important; font-weight: 600; }
                .small-text { font-size: 0.78rem !important; color: #64748b; }
                .tracking-wider { letter-spacing: 0.06em !important; }
                .tracking-tight { letter-spacing: -0.02em !important; }
                .text-slate-900 { color: #0f172a !important; }
                .text-slate-700 { color: #334155 !important; }
                .bg-slate-50 { background-color: #f8fafc !important; }
                .max-width-search { max-width: 480px; width: 100%; }
                .custom-placeholder::placeholder {color: #94a3b8 !important;opacity: 1 !important;}
                
                /* Micro Status Palettes */
                .bg-blue-light { background-color: #eff6ff; } .text-blue { color: #2563eb; }
                .bg-emerald-light { background-color: #ecfdf5; } .text-emerald { color: #059669; }
                .bg-amber-light { background-color: #fffbeb; } .text-amber { color: #d97706; }
                .bg-success-light { background-color: #f0fdf4; } .text-success { color: #16a34a; }
                .bg-warning-light { background-color: #fff9db; } .text-warning { color: #f59f00; }
                .bg-emerald-light-alpha { background-color: rgba(5, 150, 105, 0.04); border: 1px solid rgba(5, 150, 105, 0.1); }
                .bg-amber-light-alpha { background-color: rgba(217, 119, 6, 0.02); border: 1px solid rgba(217, 119, 6, 0.12); }
                
                /* Component Animations and Hover Matrices */
                .avatar-micro { width: 24px; height: 24px; background: linear-gradient(135deg, #1e293b, #475569); letter-spacing: 0px; }
                .avatar-grand { width: 56px; height: 56px; background: linear-gradient(135deg, #0f172a, #334155); font-size: 1.25rem; border: 3px solid #fff; }
                .table-active-premium { background-color: #f1f5f9 !important; }
                .border-left-indicator { border-left: 3px solid #0f172a !important; }
                .hover-premium:hover { background-color: #e2e8f0 !important; color: #0f172a !important; }
                .max-w-text-trunc { max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
                .max-height-addresses { max-height: 190px; }
                .sticky-sidebar { position: sticky; top: 24px; z-index: 10; border: 1px solid #e2e8f0 !important; }
                .decorative-top-accent { height: 4px; border-radius: 3px 3px 0 0; }
                .shadow-xs { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03); }
                .animate-panel { animation: slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
                
                @keyframes slideIn {
                    from { transform: translateX(15px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </div>
    </AdminLayout>
  )
}

export default AdminManageUser
