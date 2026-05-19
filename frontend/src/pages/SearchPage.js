import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout'

const SearchPage = () => {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchInPage, setSearchInPage] = useState('');
    
    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const currentQuery = queryParams.get('q') || '';

    const fetchSearchResults = async (searchWord) => {
        setLoading(true);
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/search/?q=${searchWord}`);
            const data = await response.json();
            setFoods(data);
        } catch (error) {
            console.error("Error fetching food data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setSearchInPage(currentQuery);
        fetchSearchResults(currentQuery);
    }, [currentQuery]);

    const handleInPageSearch = (e) => {
        e.preventDefault();
        navigate(`/search?q=${encodeURIComponent(searchInPage)}`);
    };
  return (
    <PublicLayout>
        <div className="py-5" style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Poppins', sans-serif" }}>
            <div className="container">
                <div className="row justify-content-center mb-5">
                    <div className="col-12 col-md-8 col-lg-6 text-center">
                        <h4 className="fw-bold text-dark mb-3">
                            {currentQuery ? `Results for "${currentQuery}"` : "Explore Our Menu"} 
                            <span className="badge bg-warning text-dark ms-2 fs-6 rounded-pill">{foods.length} found</span>
                        </h4>
                        
                        <form onSubmit={handleInPageSearch} className="input-group shadow-sm rounded-3 overflow-hidden border">
                            <input type="text" className="form-control border-0 ps-3 py-2.5"  placeholder="Search again..."  value={searchInPage} onChange={(e) => setSearchInPage(e.target.value)}style={{ boxShadow: 'none' }}/>
                            <button className="btn btn-warning px-4" type="submit" style={{ background: '#f97316', border: 'none', color: '#fff' }}>
                                <i className="bi bi-search"></i>
                            </button>
                        </form>
                    </div>
                </div>

                {loading ? (
                    <div className="d-flex justify-content-center my-5 py-5">
                        <div className="spinner-border text-warning" role="status" style={{color: '#f97316'}}>
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : foods.length === 0 ? (
                    <div className="text-center my-5 py-5">
                        <i className="bi bi-emoji-frown display-1 text-muted"></i>
                        <h3 className="mt-3 fw-bold text-secondary">Oops! No Food Found</h3>
                        <p className="text-muted">Try checking your spelling or search for something else like 'Burger' or 'Pizza'.</p>
                    </div>
                ) : (
                    <div className="row g-4">
                        {foods.map((food) => (
                            <div key={food.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                <div className="card h-100 border-0 rounded-4 overflow-hidden position-relative food-premium-card" style={{ boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)', transition: 'all 0.3s ease-in-out', backgroundColor: '#fff'}}>
                                    <div className="position-relative overflow-hidden" style={{ height: '200px' }}>
                                        <img src={food.image} alt={food.item_name} className="w-100 h-100 object-cover food-card-img" style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}/>

                                        <span className="position-absolute top-3 start-3 badge bg-white text-dark shadow-sm px-2.5 py-1.5 rounded-3 fw-bold small" style={{ top: '12px', left: '12px', fontSize: '11px' }}>
                                            <i className="bi bi-tag-fill text-warning me-1" style={{color: '#f97316'}}></i> {food.category_name}
                                        </span>

                                        <span className="position-absolute bottom-3 end-3 badge bg-dark bg-opacity-75 text-white px-2.5 py-1.5 rounded-3" style={{ bottom: '12px', right: '12px', fontSize: '11px' }}>
                                            <i className="bi bi-box-seam me-1"></i> {food.item_quantity}
                                        </span>
                                    </div>

                                    <div className="card-body d-flex flex-column p-4">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <h5 className="card-title fw-bold text-dark text-truncate mb-0" style={{ fontSize: '18px' }} title={food.item_name}>
                                                {food.item_name}
                                            </h5>
                                        </div>

                                        <p className="card-text text-secondary small flex-grow-1 lh-base" style={{ display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {food.item_description || "No description available for this delicious recipe."}
                                        </p>

                                        <div className="d-flex align-items-center justify-content-between mt-3 pt-3 border-top" style={{ borderColor: '#f1f5f9' }}>
                                            <div>
                                                <small className="text-muted d-block" style={{ fontSize: '11px' }}>Price</small>
                                                <span className="fw-extrabold fs-4 text-dark" style={{ letterSpacing: '-0.5px' }}>
                                                    ${food.item_price}
                                                </span>
                                            </div>

                                            {food.is_available ? (
                                                <button className="btn fw-bold px-4 py-2 rounded-3 text-white d-flex align-items-center gap-2 order-now-btn" style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', border: 'none', fontSize: '13.5px', transition: 'all 0.2s'}}>
                                                    Order <i className="bi bi-arrow-right-short fs-5"></i>
                                                </button>
                                            ) : (
                                                <button className="btn btn-light fw-bold px-3 py-2 rounded-3 text-muted disabled" style={{ fontSize: '13.5px' }}>
                                                    Sold Out
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <style>{`
                .food-premium-card:hover {transform: translateY(-6px); box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08) !important; }
                .food-premium-card:hover .food-card-img {transform: scale(1.06);}
                .order-now-btn:hover {box-shadow: 0 4px 15px rgba(249, 115, 22, 0.4);opacity: 0.95;}`}
            </style>
        </div>
    </PublicLayout>
  )
}

export default SearchPage
