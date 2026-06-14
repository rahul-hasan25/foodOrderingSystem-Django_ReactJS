import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Table, Form, Button, Spinner, Badge, InputGroup, Modal } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import AdminLayout from './../components/AdminLayout';

const BACKEND_BASE_URL = "http://127.0.0.1:8000";

const ManageReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [analytics, setAnalytics] = useState({ total_reviews: 0, average_rating: 0, breakdown: {} });
    const [loading, setLoading] = useState(true);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [ratingFilter, setRatingFilter] = useState('');

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedReviewId, setSelectedReviewId] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const fetchReviewsData = async () => {
        setLoading(true);
        try {
            const reviewsRes = await axios.get(`${BACKEND_BASE_URL}/api/admin/reviews/`);
            const analyticsRes = await axios.get(`${BACKEND_BASE_URL}/api/admin/reviews/analytics/`);
            setReviews(reviewsRes.data);
            setAnalytics(analyticsRes.data);
        } catch (error) {
            console.error("Error connecting to data layer setup:", error);
            toast.error("Failed to acquire latest customer review arrays.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviewsData();
    }, []);

    const triggerDeleteConfirmation = (id) => {
        setSelectedReviewId(id);
        setShowDeleteModal(true);
    };

    const confirmReviewDeletion = async () => {
        setDeleteLoading(true);
        try {
            await axios.delete(`${BACKEND_BASE_URL}/api/admin/reviews/${selectedReviewId}/`);
            toast.success("Review ledger sequence deleted successfully.");
            setShowDeleteModal(false);
            fetchReviewsData(); // Refresh data arrays seamlessly
        } catch (error) {
            toast.error("Network transactional rejection. Re-try execution.");
        } finally {
            setDeleteLoading(false);
        }
    };

    // Helper functions for smart modern UI indicators
    const renderStarIcons = (count) => {
        return Array.from({ length: 5 }, (_, idx) => (
            <i 
                key={idx} 
                className={`bi ${idx < count ? 'bi-star-fill text-warning' : 'bi-star text-muted'} me-0.5`}
            ></i>
        ));
    };

    const getUserInitials = (name) => {
        if (!name) return "U";
        return name.split(" ").map(part => part[0]).join("").toUpperCase().substring(0, 2);
    };

    const filteredReviews = reviews.filter(rev => {
        const foodName = rev.food_details?.item_name?.toLowerCase() || '';
        const userName = rev.user_details?.full_name?.toLowerCase() || '';
        const commentText = rev.comment?.toLowerCase() || '';
        const lowerSearch = searchTerm.toLowerCase();

        const matchesSearch = foodName.includes(lowerSearch) || userName.includes(lowerSearch) || commentText.includes(lowerSearch);
        const matchesRating = ratingFilter === '' || rev.rating === parseInt(ratingFilter);

        return matchesSearch && matchesRating;
    });
  return (
    <AdminLayout>
        <div className="review-dashboard-wrapper bg-light min-vh-100 py-4 font-sans">
            <ToastContainer position="top-right" autoClose={2500} theme="dark" hideProgressBar />

            <Container fluid className="px-lg-5">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-2">
                    <div>
                        <span className="text-uppercase tracking-wider font-monospace text-muted fs-xs fw-bold">System Administration Layer</span>
                        <h1 className="h3 fw-black text-slate-900 m-0">Manage Customer Reviews</h1>
                    </div>
                    <Button variant="white" className="border shadow-xs bg-white text-slate-700 fs-xs fw-bold rounded-2 btn-icon-gap" onClick={fetchReviewsData}>
                        <i className="bi bi-arrow-clockwise"></i> Sync Matrix
                    </Button>
                </div>

                <Row className="mb-4 g-3">
                    <Col xs={12} sm={6} lg={3}>
                        <Card className="border-0 shadow-sm rounded-3 bg-white p-3 h-100">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <span className="text-muted text-uppercase tracking-wide font-monospace fs-xxs d-block fw-bold">Aggregate Volumetric Summary</span>
                                    <h2 className="fw-extrabold text-slate-900 font-monospace m-0 mt-1">{analytics.total_reviews}</h2>
                                </div>
                                <div className="metric-icon-bubble bg-indigo-light text-indigo rounded-circle d-flex align-items-center justify-content-center">
                                    <i className="bi bi-chat-square-text-fill fs-5"></i>
                                </div>
                            </div>
                            <span className="text-emerald fs-xxs fw-medium mt-2 d-block"><i className="bi bi-graph-up-arrow"></i> Live data pipeline telemetry</span>
                        </Card>
                    </Col>
                    
                    <Col xs={12} sm={6} lg={3}>
                        <Card className="border-0 shadow-sm rounded-3 bg-white p-3 h-100">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <span className="text-muted text-uppercase tracking-wide font-monospace fs-xxs d-block fw-bold">Average Rating</span>
                                    <h2 className="fw-extrabold text-slate-900 font-monospace m-0 mt-1">{analytics.average_rating} <span className="fs-6 text-muted">/ 5</span></h2>
                                </div>
                                <div className="metric-icon-bubble bg-amber-light text-warning rounded-circle d-flex align-items-center justify-content-center">
                                    <i className="bi bi-star-half fs-5"></i>
                                </div>
                            </div>
                            <div className="mt-2 text-truncate">{renderStarIcons(Math.round(analytics.average_rating))}</div>
                        </Card>
                    </Col>

                    <Col xs={12} sm={12} lg={6}>
                        <Card className="border-0 shadow-sm rounded-3 bg-white p-3 h-100">
                            <span className="text-muted text-uppercase tracking-wide font-monospace fs-xxs d-block fw-bold mb-2">Linear Histogram Spread Mapping</span>
                            <div className="d-flex align-items-center gap-2 h-100 pt-1">
                                {[5, 4, 3, 2, 1].map((star) => {
                                    const count = analytics.breakdown?.[star] || analytics.breakdown?.[String(star)] || 0;
                                    const percentage = analytics.total_reviews > 0 ? (count / analytics.total_reviews) * 100 : 0;
                                    return (
                                        <div key={star} className="flex-grow-1 text-center">
                                            <div className="progress progress-vertical bg-light rounded-pill position-relative mb-1 mx-auto" style={{ width: '8px', height: '40px' }}>
                                                <div className="progress-bar bg-dark rounded-pill" style={{ height: `${percentage}%`, width: '100%', position: 'absolute', bottom: 0 }}></div>
                                            </div>
                                            <span className="font-monospace fs-3xxs text-slate-700 d-block fw-bold">{star}★ ({count})</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                    </Col>
                </Row>

                <Card className="border-0 shadow-sm rounded-3 bg-white p-3 mb-4">
                    <Row className="g-3 align-items-center">
                        <Col xs={12} md={6} lg={4}>
                            <InputGroup size="sm" className="border rounded-2 shadow-xs bg-transparent">
                                <InputGroup.Text className="bg-transparent border-0 text-muted"><i className="bi bi-search"></i></InputGroup.Text>
                                <Form.Control type="text" placeholder="Search food, user or keyword comment details..." className="custom-placeholder border-0 shadow-none bg-transparent text-dark py-1.5 fs-xs" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                                {searchTerm && <Button variant="transparent" className="border-0 text-muted" onClick={() => setSearchTerm('')}><i className="bi bi-x-circle-fill"></i></Button>}
                            </InputGroup>
                        </Col>
                        
                        <Col xs={12} md={4} lg={3}>
                            <Form.Select size="sm" className="border rounded-2 shadow-xs text-slate-700 py-1.5 fs-xs" value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}>
                                <option value="">Filter by Score Matrix (All)</option>
                                <option value="5">5 Stars Dynamic</option>
                                <option value="4">4 Stars Dynamic</option>
                                <option value="3">3 Stars Dynamic</option>
                                <option value="2">2 Stars Dynamic</option>
                                <option value="1">1 Star Dynamic</option>
                            </Form.Select>
                        </Col>

                        <Col xs={12} md={2} className="ms-md-auto text-md-end">
                            <span className="font-monospace fs-xxs text-muted fw-semibold">Matches: {filteredReviews.length} Records</span>
                        </Col>
                    </Row>
                </Card>

                <Card className="border-0 shadow-sm rounded-3 bg-white overflow-hidden mb-5">
                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="dark" className="my-3" />
                            <p className="text-muted font-monospace fs-xxs">Indexing remote server structural relational database context...</p>
                        </div>
                    ) : filteredReviews.length === 0 ? (
                        <div className="text-center py-5 px-3">
                            <div className="empty-state-bubble bg-light text-muted rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3">
                                <i className="bi bi-folder-x fs-3"></i>
                            </div>
                            <h5 className="fw-bold fs-xs text-dark text-uppercase tracking-wide m-0">Zero Matrix Concordance</h5>
                            <p className="text-muted fs-xxs mt-1 mb-0 max-w-350 mx-auto">No records match your modern query index criteria filters. Adjust lookup parameters.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table hover className="align-middle border-0 m-0 custom-admin-table">
                                <thead className="bg-slate-900 text-white font-monospace text-uppercase fs-3xxs tracking-wider border-0">
                                    <tr>
                                        <th className="py-3 ps-4" style={{ width: '60px' }}>SL</th>
                                        <th className="py-3">Food Particulars</th>
                                        <th className="py-3">User Identifiers</th>
                                        <th className="py-3" style={{ width: '130px' }}>Rating</th>
                                        <th className="py-3" style={{ width: '35%' }}>Comment</th>
                                        <th className="py-3">Date</th>
                                        <th className="py-3 pe-4 text-end" style={{ width: '100px' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody className="fs-xs border-0">
                                    {filteredReviews.map((review, index) => {
                                        const foodImage = review.food_details?.image ? (review.food_details.image.startsWith('http') ? review.food_details.image : `${BACKEND_BASE_URL}${review.food_details.image}`) : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80";

                                        return (
                                            <tr key={review.id} className="border-bottom border-light">
                                                <td className="ps-4 font-monospace text-muted fw-bold">{index + 1}</td>
                                                <td>
                                                    <div className="d-flex align-items-center gap-2.5">
                                                        <div className="table-img-wrapper rounded overflow-hidden flex-shrink-0 border bg-light">
                                                            <img src={foodImage} alt="Dish representation" className="w-100 h-100 object-fit-cover" />
                                                        </div>
                                                        <div className="text-truncate" style={{ maxWidth: '180px' }}>
                                                            <strong className="text-slate-900 d-block text-truncate lh-sm">{review.food_details?.item_name || "Unknown item"}</strong>
                                                            <span className="text-muted font-monospace fs-3xxs">ID: F-{review.food}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className="avatar-initials rounded-circle d-flex align-items-center justify-content-center text-white fw-bold font-monospace bg-secondary flex-shrink-0">
                                                            {getUserInitials(review.user_details?.full_name)}
                                                        </div>
                                                        <div className="text-truncate" style={{ maxWidth: '180px' }}>
                                                            <span className="fw-semibold text-slate-900 d-block text-truncate lh-sm">{review.user_details?.full_name || "Anonymous User"}</span>
                                                            <span className="text-muted fs-3xxs d-block text-truncate">{review.user_details?.email}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="text-nowrap">{renderStarIcons(review.rating)}</div>
                                                    <Badge bg={review.rating >= 4 ? 'success-light' : review.rating === 3 ? 'warning-light' : 'danger-light'} className="mt-1 font-monospace text-uppercase tracking-wider rounded-1 fs-4xxs">
                                                        {review.rating}.0 / 5.0 Score
                                                    </Badge>
                                                </td>
                                                <td>
                                                    <p className="m-0 text-slate-700 font-sans text-break table-comment-clamp">
                                                        {review.comment}
                                                    </p>
                                                </td>
                                                <td>
                                                    <span className="text-slate-900 fw-medium d-block lh-sm">{review.formatted_date?.split(' ')[0]} {review.formatted_date?.split(' ')[1]} {review.formatted_date?.split(' ')[2]}</span>
                                                    <span className="text-muted font-monospace fs-3xxs">{review.formatted_date?.split(' ').slice(3).join(' ')}</span>
                                                </td>
                                                <td className="pe-4 text-end">
                                                    <Button variant="light" size="sm" className="btn-action-trash text-danger rounded-2 shadow-xs" onClick={() => triggerDeleteConfirmation(review.id)}>
                                                        <i className="bi bi-trash3-fill"></i>
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Card>
            </Container>

            <Modal show={showDeleteModal} onHide={() => !deleteLoading && setShowDeleteModal(false)} centered size="sm">
                <Modal.Body className="text-center p-4">
                    <div className="text-danger mb-3">
                        <i className="bi bi-exclamation-triangle-fill fs-1"></i>
                    </div>
                    <h5 className="fw-black text-slate-900 mb-1">Delete Review?</h5>
                    <p className="text-muted fs-xxs px-2 mb-4">This action permanently deletes this record from the database architecture layer.</p>
                    <div className="d-flex gap-2">
                        <Button variant="light" size="sm" className="w-100 fs-xs font-monospace rounded-2 fw-bold" disabled={deleteLoading} onClick={() => setShowDeleteModal(false)}>
                            CANCEL
                        </Button>
                        <Button variant="danger" size="sm" className="w-100 fs-xs font-monospace rounded-2 fw-bold" disabled={deleteLoading} onClick={confirmReviewDeletion}>
                            {deleteLoading ? <Spinner animation="border" size="sm" /> : "CONFIRM"}
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>

            <style>{`
                .review-dashboard-wrapper { font-family: 'Inter', -apple-system, sans-serif; letter-spacing: -0.01em; }
                .fs-xs { font-size: 0.815rem !important; }
                .fs-xxs { font-size: 0.72rem !important; }
                .fs-3xxs { font-size: 0.64rem !important; letter-spacing: 0.04em; }
                .fs-4xxs { font-size: 0.58rem !important; letter-spacing: 0.05em; font-weight: 800; }
                
                .text-slate-900 { color: #0f172a !important; }
                .text-slate-700 { color: #475569 !important; }
                .text-emerald { color: #10b981 !important; }
                .bg-slate-900 { background-color: #0f172a !important; }
                
                .bg-indigo-light { background-color: #e0e7ff !important; }
                .text-indigo { color: #4f46e5 !important; }
                .bg-amber-light { background-color: #fef3c7 !important; }
                
                .bg-success-light { background-color: #ecfdf5 !important; color: #065f46 !important; border: 1px solid #a7f3d0; }
                .bg-warning-light { background-color: #fffbp7 !important; color: #92400e !important; border: 1px solid #fde68a; }
                .bg-danger-light { background-color: #fef2f2 !important; color: #991b1b !important; border: 1px solid #fecaca; }

                .shadow-xs { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important; }
                .metric-icon-bubble { width: 44px; height: 44px; }
                .empty-state-bubble { width: 64px; height: 64px; }
                .max-w-350 { max-width: 350px; }

                .custom-placeholder::placeholder {color: #94a3b8 !important;opacity: 1 !important;}
                .custom-admin-table tbody tr { transition: background-color 0.15s ease; }
                .custom-admin-table tbody tr:hover { background-color: #f8fafc !important; }
                .table-img-wrapper { width: 42px; height: 42px; }
                .avatar-initials { width: 32px; height: 32px; font-size: 11px; background: linear-gradient(135deg, #64748b 0%, #475569 100%); }
                .table-comment-clamp { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.4; max-height: 2.8rem; }
                
                .btn-action-trash { padding: 4px 8px; border: 1px solid #f1f5f9; background-color: #fff; }
                .btn-action-trash:hover { background-color: #fef2f2 !important; border-color: #fca5a5 !important; }
                .btn-icon-gap { display: inline-flex; align-items: center; gap: 6px; }`}
            </style>
        </div>
    </AdminLayout>
  )
}

export default ManageReviews
