import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import PublicLayout from '../components/PublicLayout'
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

const FoodDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [food, setFood] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [processingCart, setProcessingCart] = useState(false);

    const [zoomStyle, setZoomStyle] = useState({ display: 'none' });
    const [zoomBgStyle, setZoomBgStyle] = useState({});

    const [userRating, setUserRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

    const currentUserId = localStorage.getItem('userId'); 

    useEffect(() => {
        getFoodData();
    }, [id]);

    const getFoodData = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/foods/${id}/`);
            setFood(response.data);
        } catch (error) {
            toast.error("Error connecting to server. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = e.pageX - left - window.scrollX;
        const y = e.pageY - top - window.scrollY;

        const posX = (x / width) * 100;
        const posY = (y / height) * 100;

        setZoomStyle({
            display: 'block',
            left: `${x - 75}px`,
            top: `${y - 75}px`
        });
        setZoomBgStyle({
            backgroundImage: `url(${food?.image})`,
            backgroundPosition: `${posX}% ${posY}%`,
            backgroundSize: `${width * 2}px ${height * 2}px`
        });
    };

    const handleMouseLeave = () => {
        setZoomStyle({ display: 'none' });
    };

    const handleCartAction = async () => {
        if (!currentUserId) {
            toast.warning("Please sign in to construct your Express order tracking bag!");
            navigate('/user/login', { state: { from: `/foods/${id}` } });
            return;
        }

        setProcessingCart(true);

        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/api/cart/add/`, 
                {
                    food_id: id,
                    quantity: quantity,
                    user_id: currentUserId 
                },
                {
                    headers: {
                        'X-User-Id': currentUserId
                    }
                }
            );

            if (response.data.success) {
                toast.success(response.data.message || `${quantity}x ${food.item_name} added successfully!`);
                navigate('/cart');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Network aggregation interface error. Core server unreachable.");
            }
        } finally {
            setProcessingCart(false);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        if (!currentUserId) {
            toast.warning("Authentication required to file dining evaluations.");
            navigate('/user/login');
            return;
        }

        if (!comment.trim()) return toast.warning("Please enter your message context!");

        setSubmittingReview(true);
        try {
            await axios.post(`http://127.0.0.1:8000/api/foods/${id}/add-review/`, {
                user_id: currentUserId,
                rating: userRating,
                comment: comment
            });
            toast.success("Review posted successfully!");
            setComment('');
            getFoodData();
        } catch (err) {
            toast.error("Failed to append review data.");
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center bg-light" style={{ minHeight: '100vh' }}>
            <div className="spinner-border text-dark" role="status" style={{ width: '3rem', height: '3rem' }}></div>
        </div>
    );

    if (!food) return <div className="text-center py-5 fs-4 text-secondary">The specified luxury dish does not exist.</div>;

    return (
        <PublicLayout>
            <div className="min-vh-100 py-5" style={{ backgroundColor: '#FAF9F6', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <div className="container">
                    <div className="row g-5 align-items-start mb-5">
                        <div className="col-12 col-lg-6">
                            <div className="position-relative overflow-hidden rounded-4 bg-white border shadow-sm container-magnifier" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ height: '480px', cursor: 'crosshair' }}>
                                <img src={food.image} alt={food.item_name} className="w-100 h-100 object-fit-cover transition-all"/>
                                <div className="position-absolute rounded-circle border border-2 border-white shadow magnifier-lens" style={{ ...zoomStyle, ...zoomBgStyle, width: '150px', height: '150px', pointerEvents: 'none', backgroundRepeat: 'no-repeat' }}/>
                            </div>
                        </div>

                        {/* Panel View Display */}
                        <div className="col-12 col-lg-6">
                            <div className="ps-lg-3">
                                <div className="d-flex flex-wrap gap-2 mb-3 align-items-center">
                                    <span className="badge text-white px-3 py-2 rounded-pill shadow-sm" style={{ backgroundColor: '#E2583E', fontSize: '12px' }}>
                                        {food.category_name}
                                    </span>
                                    {food.tags_list?.map((tag, idx) => (
                                        <span key={idx} className="badge bg-secondary-subtle text-dark border px-2.5 py-1.5 rounded-pill" style={{ fontSize: '11px' }}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <h1 className="fw-black text-dark mb-2" style={{ fontSize: '38px', fontWeight: '800' }}>{food.item_name}</h1>
                                
                                <div className="d-flex align-items-center gap-3 mb-4 bg-white p-2 border rounded-3 shadow-sm d-inline-flex">
                                    <div className="text-warning d-flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <i key={i} className={`bi ${i < Math.floor(food.average_rating) ? 'bi-star-fill' : 'bi-star'}`}></i>
                                        ))}
                                    </div>
                                    <span className="fw-bold text-dark mt-0.5">{food.average_rating} Stars</span>
                                    <div className="vr text-muted"></div>
                                    <span className="text-muted small mt-0.5">({food.review_count} Customer reviews)</span>
                                </div>

                                <div className="d-flex align-items-center gap-3 mb-4">
                                    {food.discount_price ? (
                                        <>
                                            <h2 className="fw-extrabold m-0 text-danger" style={{ fontWeight: '800' }}>৳{food.discount_price}</h2>
                                            <del className="text-muted fs-5">৳{food.item_price}</del>
                                        </>
                                    ) : (
                                        <h2 className="fw-extrabold m-0 text-dark" style={{ fontWeight: '800' }}>৳{food.item_price}</h2>
                                    )}
                                    <span className={`badge px-3 py-1.5 rounded-2 ms-2 ${food.is_available ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-danger-subtle text-danger border border-danger-subtle'}`}>
                                        {food.is_available ? '● Freshly Prepared / In Stock' : '✕ Out of Stock'}
                                    </span>
                                </div>

                                <p className="text-secondary lh-lg mb-4" style={{ fontSize: '15px' }}>
                                    {food.item_description || "Indulge in our exquisite gourmet selection curated by top chefs using ethically sourced, farm-fresh premium ingredients."}
                                </p>

                                <div className="row g-3 bg-white p-3 rounded-4 border shadow-sm mb-4">
                                    <div className="col-6 col-md-4">
                                        <div className="text-muted small mb-1"><i className="bi bi-box-seam me-1"></i> Serving Size</div>
                                        <span className="fw-bold text-dark">{food.item_quantity}</span>
                                    </div>
                                    <div className="col-6 col-md-4">
                                        <div className="text-muted small mb-1"><i className="bi bi-truck me-1"></i> Delivery Fee</div>
                                        <span className="fw-bold text-dark">৳{food.shipping_charge}</span>
                                    </div>
                                    <div className="col-6 col-md-4">
                                        <div className="text-muted small mb-1"><i className="bi bi-lightning-charge me-1"></i> Cook Time</div>
                                        <span className="fw-bold text-dark">{food.preparation_time} mins</span>
                                    </div>
                                    {food.calories && (
                                        <div className="col-6 col-md-4 mt-md-3">
                                            <div className="text-muted small mb-1"><i className="bi bi-fire me-1"></i> Energy Value</div>
                                            <span className="fw-bold text-dark">{food.calories} kcal</span>
                                        </div>
                                    )}
                                </div>

                                <div className="d-flex flex-wrap gap-3 align-items-center pt-2">
                                    <div className="d-flex align-items-center bg-white border border-2 rounded-3 p-1 shadow-sm" style={{ width: '130px' }}>
                                        <button className="btn btn-link text-decoration-none text-dark fw-bold px-2 m-0 fs-5" onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)}>-</button>
                                        <span className="form-control text-center border-0 bg-transparent p-0 m-0 fw-bold fs-5 text-dark">{quantity}</span>
                                        <button className="btn btn-link text-decoration-none text-dark fw-bold px-2 m-0 fs-5" onClick={() => setQuantity(q => q + 1)}>+</button>
                                    </div>

                                    <button className="btn px-5 text-white shadow fw-bold flex-grow-1 premium-action-btn d-flex align-items-center justify-content-center gap-2" disabled={!food.is_available || processingCart} onClick={handleCartAction} style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '12px', height: '52px' }} >
                                        {processingCart ? (
                                            <span className="spinner-border spinner-border-sm" role="status"></span>
                                        ) : (
                                            <i className="bi bi-cart4 fs-5"></i>
                                        )}
                                        <span>{processingCart ? "Securing Bag..." : "Add to Cart"}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feedback Elements Setup */}
                    <div className="mt-5 pt-5 border-top border-2">
                        <div className="row g-4">
                            <div className="col-12 col-lg-7">
                                <h4 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
                                    <i className="bi bi-chat-left-text-fill text-muted"></i> Gastronomy Feedback ({food.reviews?.length || 0})
                                </h4>
                                
                                <div className="d-flex flex-column gap-3">
                                    {!food.reviews || food.reviews.length === 0 ? (
                                        <div className="bg-white text-center border rounded-4 p-5 text-muted shadow-sm">
                                            <i className="bi bi-chat-square-dots fs-1 text-muted mb-3 d-block"></i>
                                            No reviews have been logged yet for this dish.
                                        </div>
                                    ) : (
                                        food.reviews.map((rev) => (
                                            <div key={rev.id} className="card border-0 shadow-sm p-4 rounded-4 bg-white">
                                                <div className="d-flex justify-content-between align-items-start mb-3">
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm" style={{ width: '44px', height: '44px', background: '#475569', fontSize: '15px' }}>
                                                            {rev.user_name?.charAt(0).toUpperCase() || 'U'}
                                                        </div>
                                                        <div>
                                                            <h6 className="m-0 fw-bold text-dark mb-0.5">{rev.user_name}</h6>
                                                            <small className="text-muted" style={{ fontSize: '11px' }}>Verified Buyer • {new Date(rev.created_at).toLocaleDateString()}</small>
                                                        </div>
                                                    </div>
                                                    <div className="text-warning bg-light border px-2 py-1 rounded-2 d-flex gap-0.5" style={{ fontSize: '12px' }}>
                                                        {[...Array(5)].map((_, idx) => (
                                                            <i key={idx} className={`bi ${idx < rev.rating ? 'bi-star-fill' : 'bi-star'}`}></i>
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-secondary mb-0 small lh-base ps-1">{rev.comment}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="col-12 col-lg-5">
                                <div className="card border p-4 rounded-4 bg-white shadow-sm position-sticky" style={{ top: '30px' }}>
                                    <h5 className="fw-bold text-dark mb-3">Share Your Dining Experience</h5>
                                    <form onSubmit={handleReviewSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label text-muted small fw-semibold mb-1">Your Score</label>
                                            <div className="d-flex gap-2 text-warning fs-3">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <i key={star} className={`bi ${star <= userRating ? 'bi-star-fill' : 'bi-star'}`} style={{ cursor: 'pointer', transition: 'transform 0.1s ease' }} onClick={() => setUserRating(star)}></i>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label text-muted small fw-semibold mb-1">Your Comments</label>
                                            <textarea required rows="4" className="custom-placeholder text-dark form-control border bg-light custom-input" placeholder="Tell us how it tasted, packaging, freshness..." value={comment} onChange={(e) => setComment(e.target.value)} style={{ fontSize: '14px', resize: 'none', borderRadius: '10px' }} ></textarea>
                                        </div>

                                        <button type="submit" disabled={submittingReview} className="btn btn-dark w-100 fw-bold border-0" style={{ height: '48px', borderRadius: '10px', backgroundColor: '#E2583E' }}>
                                            {submittingReview ? <span className="spinner-border spinner-border-sm"></span> : "Publish Review"}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <style>{`
                    .premium-action-btn { transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s; }
                    .premium-action-btn:hover:not([disabled]) { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(15,23,42,0.2) !important; }
                    .custom-placeholder::placeholder {color: #94a3b8 !important;opacity: 1 !important;}
                    .custom-input:focus { background-color: #fff !important; border-color: #E2583E !important; box-shadow: 0 0 0 3px rgba(226,88,62,0.15) !important; }
                `}</style>
            </div>
        </PublicLayout>
    );
};

export default FoodDetails;