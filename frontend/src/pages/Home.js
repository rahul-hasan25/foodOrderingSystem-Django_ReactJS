import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if(searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
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
                    <button type="button" className="btn btn-link p-0 text-warning text-decoration-none me-2 shadow-none d-flex align-items-center gap-1" style={{ fontSize: '13px' }}>
                        <i className="bi bi-geo-alt-fill"></i>
                        <span className="d-none d-md-inline">Nearby</span>
                    </button>
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
    </PublicLayout>
  )
}

export default Home
