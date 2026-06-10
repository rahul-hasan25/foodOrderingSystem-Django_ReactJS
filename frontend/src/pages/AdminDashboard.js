import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Table, Spinner, Button } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import AdminLayout from '../components/AdminLayout';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboardAnalytics = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/admin/dashboard/analytics/');
            setAnalytics(response.data);
        } catch (error) {
            toast.error("Failed to load global financial analytics data layers.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardAnalytics();
    }, [fetchDashboardAnalytics]);

    if (loading || !analytics) {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center bg-slate-50 min-vh-100">
                <Spinner animation="border" variant="dark" size="sm" className="mb-2" />
                <span className="text-secondary tracking-wider font-monospace fs-xxs italic">Compiling system core ledger aggregates...</span>
            </div>
        );
    }

    const { metrics, top_selling_food, monthly_sales_chart, weekly_sales_chart, user_registration_chart } = analytics;

    const metricCards = [
        { label: "Total Orders", val: metrics.total_orders, icon: "bi-cart-fill", color: "blue" },
        { label: "New Orders", val: metrics.new_orders, icon: "bi-plus-circle-fill", color: "amber" },
        { label: "Confirm Order", val: metrics.confirmed_orders, icon: "bi-check-circle-fill", color: "indigo" },
        { label: "Food Being Prepared", val: metrics.preparing_orders, icon: "bi-egg-fried", color: "orange" },
        { label: "Food Pickup", val: metrics.pickup_orders, icon: "bi-truck", color: "cyan" },
        { label: "Food Delivered", val: metrics.delivered_orders, icon: "bi-bag-check-fill", color: "emerald" },
        { label: "Cancelled Order", val: metrics.cancelled_orders, icon: "bi-x-octagon-fill", color: "rose" },
        { label: "Total User", val: metrics.total_users, icon: "bi-people-fill", color: "violet" },
        { label: "Today's Sales", val: `$${metrics.todays_sales.toFixed(2)}`, icon: "bi-cash-coin", color: "emerald", premium: true },
        { label: "This Week Sales", val: `$${metrics.this_week_sales.toFixed(2)}`, icon: "bi-graph-up-arrow", color: "teal", premium: true },
        { label: "This Month Sales", val: `$${metrics.this_month_sales.toFixed(2)}`, icon: "bi-wallet2", color: "fuchsia", premium: true },
        { label: "This Year Sales", val: `$${metrics.this_year_sales.toFixed(2)}`, icon: "bi-bank", color: "purple", premium: true },
        { label: "Total Categories", val: metrics.total_categories, icon: "bi-tags-fill", color: "slate" },
        { label: "Total Reviews", val: metrics.total_reviews, icon: "bi-star-half", color: "yellow" }
    ];
  return (
    <AdminLayout>
      <div className="style-scope-admin-bi position-relative min-vh-100 pb-5">
        <ToastContainer position="top-right" autoClose={2500} hideProgressBar={true} />

        <div className="bg-white border-bottom py-3 sticky-top shadow-xs z-index-100">
            <Container fluid className="px-4 d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div>
                    <h1 className="fw-extrabold text-slate-900 tracking-tight m-0 fs-5">FoodExpress Core Engine Control</h1>
                    <p className="text-muted small-text m-0">Synchronized system performance ledger indexes and user velocity metrics.</p>
                </div>
                <Button variant="dark" className="btn-sm rounded-2 font-monospace fs-xxs px-3" onClick={fetchDashboardAnalytics}>
                    <i className="bi bi-arrow-clockwise me-1"></i> Sync Cloud Analytics
                </Button>
            </Container>
        </div>

        <Container fluid className="px-4 mt-4">
          {/* Section 1: Data Analytics Grid Cards */}
          <Row className="g-3 mb-4">
              {metricCards.map((card, idx) => (
                  <Col key={idx} xs={6} sm={6} md={4} lg={3} xl={2}>
                      <Card className={`border-0 rounded-3 shadow-xs h-100 position-relative bg-white transition-hover-card overflow-hidden ${card.premium ? 'border-premium-indicator' : ''}`}>
                          <div className="p-3 d-flex flex-column justify-content-between h-100">
                              <div className="d-flex align-items-start justify-content-between mb-2">
                                  <span className="text-uppercase text-secondary tracking-wider fs-xxs font-semibold d-block text-truncate max-w-85">{card.label}</span>
                                  <div className={`icon-wrapper-sm bg-${card.color}-light text-${card.color} rounded-2 d-flex align-items-center justify-content-center`}>
                                      <i className={`bi ${card.icon} fs-xs`}></i>
                                  </div>
                              </div>
                              <div>
                                  <h3 className={`m-0 fw-extrabold font-monospace text-slate-900 tracking-tight ${card.premium ? 'fs-5 text-emerald-dark' : 'fs-6'}`}>
                                      {card.val}
                                  </h3>
                              </div>
                          </div>
                      </Card>
                  </Col>
              ))}
          </Row>

          {/* Section 2: Data Visualizations (Charts & Leaderboards) */}
          <Row className="g-4 mb-4">
              {/* Monthly Sales Area Analytical Panel */}
              <Col xs={12} lg={8}>
                  <Card className="border-0 rounded-3 bg-white shadow-xs p-3 h-100">
                      <div className="mb-3">
                          <h5 className="fw-bold fs-xs text-slate-900 m-0 text-uppercase tracking-wider">Monthly Core Sales Ledger</h5>
                          <span className="text-muted fs-xxs">Analytical visualization of gross volume billing mapping inside current fiscal calendar.</span>
                      </div>
                      <div className="chart-wrapper-std custom-chart-axis">
                          <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={monthly_sales_chart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                  <defs>
                                      <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                                      </linearGradient>
                                  </defs>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                  <XAxis dataKey="month" tickLine={false} stroke="#94a3b8" />
                                  <YAxis tickLine={false} stroke="#94a3b8" />
                                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '6px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                                  <Area type="monotone" dataKey="sales" name="Gross Revenue" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#salesGrad)" />
                              </AreaChart>
                          </ResponsiveContainer>
                      </div>
                  </Card>
              </Col>

              {/* Top 5 High Velocity Dishes Menu Leaderboard DataTable */}
              <Col xs={12} lg={4}>
                  <Card className="border-0 rounded-3 bg-white shadow-xs p-3 h-100">
                      <div className="mb-3">
                          <h5 className="fw-bold fs-xs text-slate-900 m-0 text-uppercase tracking-wider">Top 5 Revenue Dishes</h5>
                          <span className="text-muted fs-xxs">Menu items generating top transaction matrix tracking.</span>
                      </div>
                      <div className="table-responsive text-nowrap custom-scrollbar overflow-y-auto max-height-320">
                          <Table hover responsive align="middle" className="mb-0 border-0 fs-xxs">
                              <thead className="bg-slate-50 text-secondary border-bottom">
                                  <tr>
                                      <th className="py-2 fw-bold text-uppercase tracking-wider">Dish Particular</th>
                                      <th className="py-2 text-center fw-bold text-uppercase tracking-wider">Units Sold</th>
                                      <th className="py-2 text-end fw-bold text-uppercase tracking-wider">Revenue</th>
                                  </tr>
                              </thead>
                              <tbody className="text-slate-700 border-0 font-monospace">
                                  {top_selling_food.length === 0 ? (
                                      <tr>
                                          <td colSpan="3" className="text-center py-4 text-muted italic">No billing sales registered yet.</td>
                                      </tr>
                                  ) : (
                                      top_selling_food.map((item, idx) => (
                                          <tr key={idx}>
                                              <td className="py-2 fw-semibold text-slate-900 text-truncate max-w-140">{item.food__item_name}</td>
                                              <td className="py-2 text-center text-secondary fw-bold">{item.total_units_sold}</td>
                                              <td className="py-2 text-end text-emerald fw-extrabold">${Number(item.total_revenue_earned).toFixed(2)}</td>
                                          </tr>
                                      ))
                                  )}
                              </tbody>
                          </Table>
                      </div>
                  </Card>
              </Col>
          </Row>

          <Row className="g-4">
              {/* Weekly Sales Micro Bar Analytics */}
              <Col xs={12} md={6}>
                  <Card className="border-0 rounded-3 bg-white shadow-xs p-3">
                      <div className="mb-3">
                          <h5 className="fw-bold fs-xs text-slate-900 m-0 text-uppercase tracking-wider">Weekly Sales Pipeline</h5>
                          <span className="text-muted fs-xxs">Last 7 operational calendar days value metrics chart.</span>
                      </div>
                      <div className="chart-wrapper-std custom-chart-axis">
                          <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={weekly_sales_chart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                  <XAxis dataKey="day" tickLine={false} stroke="#94a3b8" />
                                  <YAxis tickLine={false} stroke="#94a3b8" />
                                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '6px', border: 'none' }} />
                                  <Bar dataKey="sales" name="Daily Billing" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={32} />
                              </BarChart>
                          </ResponsiveContainer>
                      </div>
                  </Card>
              </Col>

              {/* New User Consumer Registration Registration Growth Matrix Graph */}
              <Col xs={12} md={6}>
                  <Card className="border-0 rounded-3 bg-white shadow-xs p-3">
                      <div className="mb-3">
                          <h5 className="fw-bold fs-xs text-slate-900 m-0 text-uppercase tracking-wider">User Acquisition Streams</h5>
                          <span className="text-muted fs-xxs">Analysis monitoring velocity logs of new profiles registered inside 7 days.</span>
                      </div>
                      <div className="chart-wrapper-std custom-chart-axis">
                          <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={user_registration_chart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                  <XAxis dataKey="day" tickLine={false} stroke="#94a3b8" />
                                  <YAxis tickLine={false} stroke="#94a3b8" allowDecimals={false} />
                                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '6px', border: 'none' }} />
                                  <Line type="monotone" dataKey="registrations" name="New Profiles Added" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3, strokeWidth: 1 }} activeDot={{ r: 5 }} />
                              </LineChart>
                          </ResponsiveContainer>
                      </div>
                  </Card>
              </Col>
          </Row>
        </Container>

        {/* Custom Embedded Scoped View UI Engine Design System Sheet */}
        <style>{`
            .style-scope-admin-bi {
                background-color: #f8fafc !important;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
                letter-spacing: -0.01em;
            }
            .fs-xs { font-size: 0.8rem !important; }
            .fs-xxs { font-size: 0.72rem !important; }
            .small-text { font-size: 0.76rem !important; color: #64748b; }
            .tracking-wider { letter-spacing: 0.05em !important; }
            .tracking-tight { letter-spacing: -0.025em !important; }
            .text-slate-900 { color: #0f172a !important; }
            .text-slate-700 { color: #334155 !important; }
            .bg-slate-50 { background-color: #f8fafc !important; }
            .shadow-xs { box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.04) !important; }
            
            /* Dynamic Custom Color Systems for System Micro Indicators */
            .bg-blue-light { background-color: #eff6ff; } .text-blue { color: #3b82f6; }
            .bg-amber-light { background-color: #fffbeb; } .text-amber { color: #f59e0b; }
            .bg-indigo-light { background-color: #e0e7ff; } .text-indigo { color: #6366f1; }
            .bg-orange-light { background-color: #fff7ed; } .text-orange { color: #f97316; }
            .bg-cyan-light { background-color: #ecfeff; } .text-cyan { color: #06b6d4; }
            .bg-emerald-light { background-color: #f0fdf4; } .text-emerald { color: #10b981; }
            .bg-rose-light { background-color: #fff1f2; } .text-rose { color: #f43f5e; }
            .bg-violet-light { background-color: #f5f3ff; } .text-violet { color: #8b5cf6; }
            .bg-teal-light { background-color: #f0fdfa; } .text-teal { color: #14b8a6; }
            .bg-fuchsia-light { background-color: #fdf4ff; } .text-fuchsia { color: #d946ef; }
            .bg-purple-light { background-color: #faf5ff; } .text-purple { color: #a855f7; }
            .bg-slate-light { background-color: #f1f5f9; } .text-slate { color: #64748b; }
            .bg-yellow-light { background-color: #fefce8; } .text-yellow { color: #eab308; }
            .text-emerald-dark { color: #047857 !important; }

            /* Card UI Indicator Framework */
            .icon-wrapper-sm { width: 28px; height: 28px; flex-shrink: 0; }
            .transition-hover-card { transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s ease; }
            .transition-hover-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(15,23,42,0.05) !important; }
            .border-premium-indicator { border-top: 3px solid #10b981 !important; }

            /* Graph Layout Sizing Standards */
            .chart-wrapper-std { height: 240px; width: 100%; position: relative; }
            .custom-chart-axis .recharts-cartesian-axis-text { font-size: 10px !important; font-family: monospace !important; }
            
            /* List Utilities Constraints */
            .max-w-85 { max-width: 85%; }
            .max-w-140 { max-width: 140px; }
            .max-height-320 { max-height: 240px; }
            .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
        `}</style>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
