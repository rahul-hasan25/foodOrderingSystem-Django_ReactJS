import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if(searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  useEffect(() => {
    const fetchHomepageMenu = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/homepage-menu/');
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error("Error fetching homepage menu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomepageMenu();
  }, []);
  return (
    <PublicLayout>
      <div className="position-relative d-flex align-items-center overflow-hidden" style={{ minHeight: '85vh', backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.85)), url("https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center',fontFamily: "'Poppins', sans-serif"}}>
        <div className="position-absolute rounded-circle opacity-20 d-none d-lg-block" style={{ top: '10%', right: '15%', width: '300px', height: '300px', background: '#f97316', filter: 'blur(120px)' }}> </div>
        <div className="container position-relative z-1 py-5">
          <div className="row justify-content-center text-center">
            <div className="col-12 col-md-10 col-lg-8">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill mb-4 border" style={{ backgroundColor: 'rgba(249, 115, 22, 0.1)', borderColor: 'rgba(249, 115, 22, 0.3)' }}>
                <i className="bi bi-stars text-warning animate-pulse"></i>
                  <span className="text-warning fw-semibold tracking-wide" style={{ fontSize: '13px', letterSpacing: '0.5px' }}>
                      CRISPY, FRESH & LIGHTNING FAST
                  </span>
              </div>

              <h1 className="display-4 fw-extrabold text-white mb-3 tracking-tight lh-sm" style={{ fontWeight: '800', letterSpacing: '-1px' }}>
                  Satisfy Your Cravings <br className="d-none d-sm-inline" /> With <span style={{background: 'linear-gradient(to right, #f97316, #ffedd5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>FoodFlex</span> Delivery 
              </h1>

              <p className="lead text-light opacity-75 mb-5 mx-auto px-lg-5" style={{ fontSize: '17px', maxWidth: '620px' }}>
                  Discover top-rated restaurants, street foods, and premium cuisines near you. Your favorite meal is just one click away.
              </p>

              <form onSubmit={handleSearchSubmit} className="mx-auto" style={{ maxWidth: '650px' }}>
                <div className="p-2 rounded-4 shadow-lg d-flex flex-column flex-sm-row gap-2" style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',border: '1px solid rgba(255, 255, 255, 0.2)'}}>
                  <div className="d-flex align-items-center flex-grow-1 px-2 position-relative py-2 py-sm-0">
                    <i className="bi bi-search text-white opacity-75 fs-5 ms-2"></i>
                    <input type="text" name='q' className="form-control bg-transparent border-0 text-white placeholder-light shadow-none ps-3" placeholder="Search for biryani, burgers, pizza..." style={{ fontSize: '15px' }} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
                    {/* <button type="button" className="btn btn-link p-0 text-warning text-decoration-none me-2 shadow-none d-flex align-items-center gap-1" style={{ fontSize: '13px' }}>
                        <i className="bi bi-geo-alt-fill"></i>
                        <span className="d-none d-md-inline">Nearby</span>
                    </button> */}
                  </div>

                  <button type="submit" className="btn px-4 py-3 fw-bold text-white rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2 transition-all hero-search-btn" style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', border: 'none',fontSize: '15px',minWidth: '130px'}}>
                    Find Food
                  </button>
                </div>
              </form>

              <div className="d-flex flex-wrap justify-content-center gap-4 mt-5 text-white opacity-75" style={{ fontSize: '13.5px' }}>
                  <span className="d-flex align-items-center gap-2"><i className="bi bi-check-circle-fill text-warning"></i> 15k+ Restaurants</span>
                  <span className="d-flex align-items-center gap-2"><i className="bi bi-clock-fill text-warning"></i> 25 Min Avg Delivery</span>
                  <span className="d-flex align-items-center gap-2"><i className="bi bi-shield-lock-fill text-warning"></i> Secure Payment</span>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          .placeholder-light::placeholder {color: rgba(255, 255, 255, 0.6) !important;}
          .hero-search-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(249, 115, 22, 0.4) !important;}`}
        </style>
      </div>

      {/* Home Section Product */}

      <section className="py-5" style={{ backgroundColor: '#ffffff', fontFamily: "'Poppins', sans-serif" }}>
        <div className="container py-4">
          <div className="row justify-content-center text-center mb-5">
            <div className="col-12 col-md-8 col-lg-6">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2" style={{ backgroundColor: 'rgba(249, 115, 22, 0.08)' }}>
                <span className="text-uppercase fw-bold tracking-wider" style={{ color: '#f97316', fontSize: '11px', letterSpacing: '1px' }}>
                    Our Signature Menu
                </span>
              </div>

              <h2 className="fw-extrabold text-dark display-6 mb-3" style={{ fontWeight: '800', letterSpacing: '-0.5px' }}>
                  Most Popular <span style={{ color: '#f97316' }}>Cravings</span>
              </h2>

              <p className="text-secondary small">
                  Handpicked culinary masterpieces crafted by top chefs, delivered fresh and blazing hot to your table.
              </p>
          </div>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center my-5">
              <div className="spinner-grow" style={{ color: '#f97316' }} role="status">
                  <span className="visually-hidden">Loading...</span>
              </div>
          </div>
        ) : (
          <div className="row g-4">
            {menuItems.map((food, index) => (
              <div key={food.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <div className="card h-100 border-0 rounded-4 overflow-hidden position-relative home-food-card" style={{ boxShadow: '0 12px 35px rgba(15, 23, 42, 0.05)',backgroundColor: '#fff',transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)'}}>
                    <div className="position-relative overflow-hidden" style={{ height: '220px' }}>
                      <img src={food.image} alt={food.item_name} className="w-100 h-100 home-food-img" style={{ objectFit: 'cover', transition: 'transform 0.6s ease' }}/>

                      {index < 3 && (
                        <span className="position-absolute top-3 start-3 badge text-white px-2.5 py-1.5 rounded-3 d-flex align-items-center gap-1 shadow-sm" style={{ top: '12px', left: '12px', background: 'linear-gradient(135deg, #ef4444, #b91c1c)', fontSize: '10px', fontWeight: '700' }}>
                            <i className="bi bi-fire"></i> TRENDING
                        </span>
                      )}

                      <span className="position-absolute top-3 end-3 badge bg-white text-dark shadow-sm px-2.5 py-1.5 rounded-3 fw-bold" style={{ top: '12px', right: '12px', fontSize: '10px' }}>
                        {food.category_name}
                      </span>

                      <div className="position-absolute bottom-3 start-3 bg-dark bg-opacity-60 backdrop-blur text-white px-2 py-1 rounded-2" style={{ bottom: '12px', left: '12px', fontSize: '11px', backdropFilter: 'blur(4px)' }}>
                          <i className="bi bi-egg-fried me-1 text-warning"></i> {food.item_quantity}
                      </div>
                    </div>

                    <div className="card-body p-4 d-flex flex-column">
                      <Link to={`/food/${food.id}`} className="card-title fw-bold text-dark text-truncate mb-2 text-decoration-none" style={{ fontSize: '17px' }}>
                          {food.item_name}
                      </Link>
                      
                      <p className="card-text text-secondary small flex-grow-1 line-clamp-2 mb-3" style={{ display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: '13px', lineHeight: '1.5' }}>
                          {food.item_description || "Savor the rich, authentic flavors of this specially prepared premium dish."}
                      </p>

                      <div className="d-flex align-items-center justify-content-between pt-3 border-top" style={{ borderColor: '#f8fafc' }}>
                        <div>
                            <span className="fw-extrabold text-dark d-block h4 mb-0" style={{ letterSpacing: '-0.5px' }}>
                                BDT: {food.item_price}
                            </span>
                        </div>

                        <Link to={`/food/${food.id}`} className="btn d-flex align-items-center justify-content-center rounded-3 p-0 home-cart-btn" style={{ width: '40px',  height: '40px', backgroundColor: '#f1f5f9', color: '#1e293b',  border: 'none', transition: 'all 0.25s ease'}}>
                          <i className="bi bi-basket3-fill fs-5"></i>
                        </Link>
                      </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .home-food-card:hover {transform: translateY(-8px);box-shadow: 0 25px 50px rgba(15, 23, 42, 0.09) !important;}
        .home-food-card:hover .home-food-img {transform: scale(1.08);}
        .home-cart-btn:hover {background: linear-gradient(135deg, #f97316, #ea580c) !important;color: #ffffff !important; box-shadow: 0 4px 15px rgba(249, 115, 22, 0.4);transform: rotate(-6px) scale(1.05);}`}
      </style>
    </section>
  </PublicLayout>
  )
}

export default Home
