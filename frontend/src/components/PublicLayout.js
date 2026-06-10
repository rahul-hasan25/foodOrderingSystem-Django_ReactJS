import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PublicLayout = ({children}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;
  const currentYear = new Date().getFullYear();

  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [userName, setUserName] = useState(localStorage.getItem('userName'));
  
  const [cartCount, setCartCount] = useState(0);

  // Sync session authentication variables when location changes
  useEffect(() => {
    setUserId(localStorage.getItem('userId'));
    setUserName(localStorage.getItem('userName'));
  }, [location]);

  const isLoggedIn = !!userId;

  // Calls database endpoint for active counts
  const fetchCountData = useCallback(async () => {
    const activeId = localStorage.getItem('userId') || userId;
    if (!activeId) {
      setCartCount(0);
      return;
    }
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/cart/count/', {
        headers: { 'X-User-Id': activeId }
      });
      setCartCount(response.data.cart_count);
    } catch (error) {
      console.error("Error synchronizing active cart badge count metrics.", error);
    }
  }, [userId]);

  // Listens to location adjustments and polls updates periodically
  useEffect(() => {
    fetchCountData();
    window.addEventListener('cartUpdated', fetchCountData);  // Listen for the instant event coming from Cart or Menu components
    
    return () => {
      window.removeEventListener('cartUpdated', fetchCountData);
    };
  }, [location, fetchCountData]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('user');
    setCartCount(0);
    navigate('/user/login');
  };

  return (
    <>
    <nav className="navbar navbar-expand-lg navbar-light sticky-top bg-white" style={{ boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)', borderBottom: '1px solid #f1f5f9', padding: '5px 0', fontFamily: "'Poppins', sans-serif"}}>
      <div className="container">
          <Link to='/' className="navbar-brand d-flex align-items-center gap-2" style={{ textDecoration: 'none' }}>
            <div className="d-flex align-items-center justify-content-center rounded-circle text-white" style={{ width: '40px', height: '40px', fontSize: '20px', background: 'linear-gradient(135deg, #f97316 0%, #ffa14a 100%)', boxShadow: '0 4px 12px rgba(249, 115, 22, 0.2)'}}>
              <i className="bi bi-egg-fried"></i>
            </div>
            <span className="fw-bold tracking-wide" style={{ color: '#0f172a', fontSize: '20px' }}>
              Food<span style={{ color: '#f97316' }}>Express</span>
            </span>
          </Link>

          <button className="navbar-toggler border-0 shadow-none p-2" type="button" data-bs-toggle="collapse" data-bs-target="#foodflexNavbar" aria-controls="foodflexNavbar" aria-expanded="false" aria-label="Toggle navigation" >
              <i className="bi bi-list fs-2 text-dark"></i>
          </button>

          <div className="collapse navbar-collapse" id="foodflexNavbar">
            <ul className="navbar-nav ms-auto align-items-lg-center mt-3 mt-lg-0" style={{ gap: '1px' }}>
              <li className="nav-item">
                <Link to="/" className={`nav-link px-2 py-2 rounded-3 fw-semibold d-flex align-items-center gap-1 transition-all ${isActive('/') ? 'text-warning bg-warning bg-opacity-10' : 'text-secondary'}`}  style={{ fontSize: '14.5px', transition: 'all 0.2s' }}>
                    <i className="bi bi-house-door fs-5"></i> Home
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/menu" className={`nav-link px-2 py-2 rounded-3 fw-semibold d-flex align-items-center gap-1 transition-all ${isActive('/menu') ? 'text-warning bg-warning bg-opacity-10' : 'text-secondary'}`} style={{ fontSize: '14.5px', transition: 'all 0.2s' }}>
                    <i className="bi bi-journal-richtext fs-5"></i> Menu
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/track" className={`nav-link px-2 py-2 rounded-3 fw-semibold d-flex align-items-center gap-1 transition-all ${isActive('/track') ? 'text-warning bg-warning bg-opacity-10' : 'text-secondary'}`} style={{ fontSize: '14.5px', transition: 'all 0.2s' }}>
                    <i className="bi bi-geo-alt fs-5"></i> Track
                </Link>
              </li>

              {!isLoggedIn ? (
              <>
              <li className="nav-item">
                <Link to="/user/register" className={`nav-link px-2 py-2 rounded-3 fw-semibold d-flex align-items-center gap-1 transition-all ${isActive('/user/register') ? 'text-warning bg-warning bg-opacity-10' : 'text-secondary'}`} style={{ fontSize: '14.5px', transition: 'all 0.2s' }}>
                    <i className="bi bi-person-plus fs-5"></i> Register
                </Link>
              </li>

              <li className="nav-item me-lg-2">
                <Link to="/user/login" className={`nav-link px-2 py-2 rounded-3 fw-semibold d-flex align-items-center gap-1 transition-all ${isActive('/user/login') ? 'text-warning bg-warning bg-opacity-10' : 'text-secondary'}`} style={{ fontSize: '14.5px', transition: 'all 0.2s' }}>
                    <i className="bi bi-box-arrow-in-right fs-5"></i> Login
                </Link>
              </li>

              <li className="nav-item mt-2 mt-lg-0">
                <Link to="/admin-login" className="nav-link px-4 py-2 rounded-3 fw-semibold text-white d-flex align-items-center justify-content-center gap-2 shadow-sm" style={{ fontSize: '14px', backgroundColor: '#1e293b',  border: 'none', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0f172a'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}>
                    <i className="bi bi-speedometer2"></i> Admin Panel
                </Link>
              </li>

              </>

              ) : (

              <>
              <li className="nav-item">
                <Link to="/my-orders" className={`nav-link px-2 py-2 rounded-3 fw-semibold d-flex align-items-center gap-1 transition-all ${isActive('/my-orders') ? 'text-warning bg-warning bg-opacity-10' : 'text-secondary'}`} style={{ fontSize: '14.5px', transition: 'all 0.2s' }}>
                    <i className="bi bi-bag-check fs-5"></i> My Orders
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/cart" className={`nav-link px-2 py-2 rounded-3 fw-semibold d-flex align-items-center gap-1 transition-all ${isActive('/cart') ? 'text-warning bg-warning bg-opacity-10' : 'text-secondary'}`} style={{ fontSize: '14.5px', transition: 'all 0.2s' }}>
                  <div className="position-relative d-flex align-items-center gap-1 pe-2">
                    <i className="bi bi-cart3 fs-5"></i> Cart
                    
                    {cartCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger badge-pop-animation" style={{ fontSize: '10px', padding: '4px 7px', marginTop: '-4px', fontWeight: '700', boxShadow: '0 2px 8px rgba(220, 53, 69, 0.4)'}} >
                        {cartCount}
                      </span>
                    )}
                  </div>
                </Link>
              </li>

              {/* <li className="nav-item">
                <Link to="/wishlist" className={`nav-link px-2 py-2 rounded-3 fw-semibold d-flex align-items-center gap-1 transition-all ${isActive('/wishlist') ? 'text-warning bg-warning bg-opacity-10' : 'text-secondary'}`} style={{ fontSize: '14.5px', transition: 'all 0.2s' }}>
                  <i className="bi bi-heart fs-5"></i> Wishlist
                </Link>
              </li> */}

              <li className="nav-item dropdown me-lg-2">
                <a className="nav-link px-3 py-2 rounded-3 fw-bold text-dark d-flex align-items-center gap-2 user-welcome-badge dropdown-toggle border-0" href="#userMenu" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ fontSize: '14.5px', background: '#f8fafc', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                    <div className="bg-warning rounded-circle d-flex align-items-center justify-content-center text-white fw-bold" style={{ width: '24px', height: '24px', fontSize: '12px' }}>
                        {userName ? userName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    Hi, {userName || "User"}
                </a>
                
                <ul className="dropdown-menu dropdown-menu-end border-0 shadow-sm mt-2 p-2 rounded-3" aria-labelledby="navbarDropdown" style={{ minWidth: '180px', background: '#ffffff', border: '1px solid #f1f5f9' }}>
                  <li>
                    <Link to="/user/profile" className="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2 text-secondary fw-medium" style={{ fontSize: '14px' }}>
                      <i className="bi bi-person-bounding-box fs-5 text-warning"></i> My Profile
                    </Link>
                  </li>

                  <li>
                    <Link to="/user/settings" className="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2 text-secondary fw-medium" style={{ fontSize: '14px' }}>
                      <i className="bi bi-gear-fill fs-5 text-secondary"></i> Settings
                    </Link>
                  </li>

                  <li><hr className="dropdown-divider" style={{ borderColor: '#f1f5f9' }} /></li>

                  <li>
                    <button onClick={handleLogout} className="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2 text-danger fw-semibold" style={{ fontSize: '14px' }}>
                      <i className="bi bi-power fs-5"></i> Logout
                    </button>
                  </li>
                </ul>
              </li>
              </>
              )}
            </ul>
          </div>
      </div>
  </nav>

  <div>{children}</div>

  <section className="py-5" style={{ backgroundColor: '#f8fafc', fontFamily: "'Poppins', sans-serif", borderTop: '1px solid #f1f5f9' }}>
    <div className="container py-4">
      <div className="text-center mb-5">
        <span className="badge px-3 py-2 rounded-pill mb-2 fw-bold text-uppercase tracking-wider" style={{ backgroundColor: 'rgba(249, 115, 22, 0.1)', color: '#f97316', fontSize: '11px' }}>
            How It Works
        </span>
        <h2 className="fw-extrabold text-dark tracking-tight" style={{ fontWeight: '800', fontSize: '28px' }}>
            Ordering in <span style={{ color: '#f97316' }}>3 Simple Steps</span>
        </h2>
        <p className="text-secondary small mx-auto" style={{ maxWidth: '450px' }}>
            Craving something delicious? Getting your favorite meal delivered to your doorstep has never been this fast and effortless.
        </p>
      </div>

      <div className="row g-4 justify-content-center">
        <div className="col-12 col-md-4">
            <div className="card h-100 text-center p-4 border-0 rounded-4 step-card shadow-sm bg-white" style={{ transition: 'all 0.3s ease-in-out' }}>
                <div className="mx-auto rounded-circle d-flex align-items-center justify-content-center text-white mb-4 position-relative" style={{ width: '70px', height: '70px', background: 'linear-gradient(135deg, #f97316 0%, #ffa14a 100%)', boxShadow: '0 8px 20px rgba(249, 115, 22, 0.2)' }}>
                    <i className="bi bi-egg-fried fs-2"></i>
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-dark fw-bold d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px', fontSize: '12px' }}>1</span>
                </div>
                <h5 className="fw-bold text-dark mb-2" style={{ fontSize: '17px' }}>Pick a Dish You Love</h5>
                <p className="text-secondary small mb-0 lh-base">
                    Browse our rich, curated menu featuring hundreds of delicious dishes tailored just for your taste buds.
                </p>
            </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card h-100 text-center p-4 border-0 rounded-4 step-card shadow-sm bg-white" style={{ transition: 'all 0.3s ease-in-out' }}>
            <div className="mx-auto rounded-circle d-flex align-items-center justify-content-center text-white mb-4 position-relative" style={{ width: '70px', height: '70px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', boxShadow: '0 8px 20px rgba(30, 41, 59, 0.2)' }}>
              <i className="bi bi-geo-alt-fill fs-2" style={{ color: '#f97316' }}></i>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-warning text-dark fw-bold d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px', fontSize: '12px', background: '#f97316' }}>2</span>
            </div>
            <h5 className="fw-bold text-dark mb-2" style={{ fontSize: '17px' }}>Share Your Location</h5>
            <p className="text-secondary small mb-0 lh-base">
                Pin your current address or delivery spot on our map so our quick delivery heroes can find you in a flash.
            </p>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card h-100 text-center p-4 border-0 rounded-4 step-card shadow-sm bg-white" style={{ transition: 'all 0.3s ease-in-out' }}>
            <div className="mx-auto rounded-circle d-flex align-items-center justify-content-center text-white mb-4 position-relative" style={{ width: '70px', height: '70px', background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)', boxShadow: '0 8px 20px rgba(234, 88, 12, 0.2)' }}>
                <i className="bi bi-bicycle fs-2"></i>
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-dark fw-bold d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px', fontSize: '12px' }}>3</span>
            </div>
            <h5 className="fw-bold text-dark mb-2" style={{ fontSize: '17px' }}>Enjoy Doorstep Delivery</h5>
            <p className="text-secondary small mb-0 lh-base">
                Sit back, relax, and track your food live as it arrives fresh, blazing hot, and full of rich flavor.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <footer style={{ backgroundColor: '#ffffff', fontFamily: "'Poppins', sans-serif",position: 'relative'}}>
    <div style={{ height: '4px', background: 'linear-gradient(90deg, #f97316 0%, #ea580c 50%, #ffedd5 100%)', width: '100%'}}></div>
    <div className="container py-5">
      <div className="row g-4">
          <div className="col-12 col-md-6 col-lg-4">
              <Link to="/" className="d-flex align-items-center gap-2 mb-3" style={{ textDecoration: 'none' }}>
                  <div className="rounded-3 d-flex align-items-center justify-content-center text-white" style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #f97316, #ea580c)'}}>
                      <i className="bi bi-lightning-charge-fill fs-5"></i>
                  </div>

                  <span className="fw-bold text-dark tracking-tight" style={{ fontSize: '22px', letterSpacing: '-0.5px' }}>
                      Food<span style={{ color: '#f97316' }}>Flex</span>
                  </span>
              </Link>

              <p className="text-secondary small lh-base mb-4" style={{ maxWidth: '300px' }}>
                  Delicious meals delivered straight to your doorstep. Fresh, fast, and always hot.
              </p>
              
              <div className="d-flex gap-2">
                  {['facebook', 'instagram', 'twitter', 'youtube'].map((social) => (
                      <a key={social} href={`#${social}`} className="btn d-flex align-items-center justify-content-center rounded-3 p-0" style={{ width: '36px', height: '36px', backgroundColor: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0', transition: 'all 0.2s ease-in-out'}} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f97316'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#f97316'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(249, 115, 22, 0.35)';}} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none';}}>
                          <i className={`bi bi-${social}`}></i>
                      </a>
                  ))}
              </div>
          </div>

          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="fw-bold text-dark mb-3" style={{ fontSize: '15px' }}>Company</h6>
            <ul className="list-unstyled d-flex flex-column gap-2" style={{ fontSize: '14.5px' }}>
              <li><Link to="/" className="custom-footer-link text-secondary text-decoration-none">About Us</Link></li>
              <li><Link to="/menu" className="custom-footer-link text-secondary text-decoration-none">Our Menu</Link></li>
              <li><a href="#careers" className="custom-footer-link text-secondary text-decoration-none">Careers</a></li>
              <li><a href="#blog" className="custom-footer-link text-secondary text-decoration-none">Latest Blog</a></li>
            </ul>
          </div>

          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="fw-bold text-dark mb-3" style={{ fontSize: '15px' }}>Support</h6>
            <ul className="list-unstyled d-flex flex-column gap-2" style={{ fontSize: '14.5px' }}>
                <li><Link to="/track" className="custom-footer-link text-secondary text-decoration-none">Track Order</Link></li>
                <li><a href="#faq" className="custom-footer-link text-secondary text-decoration-none">Help FAQs</a></li>
                <li><a href="#privacy" className="custom-footer-link text-secondary text-decoration-none">Privacy Policy</a></li>
                <li><a href="#contact" className="custom-footer-link text-secondary text-decoration-none">Contact Us</a></li>
            </ul>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <h6 className="fw-bold text-dark mb-3" style={{ fontSize: '15px' }}>Stay Updated</h6>
            <p className="small text-secondary mb-3">Subscribe to get special offers and sweet discounts.</p>
            
            <div className="d-flex p-1 rounded-3" style={{ backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0' }}>
                <input type="email" className="custom-placeholder form-control bg-transparent border-0 shadow-none ps-3 py-2 text-dark" placeholder="Your email..."  style={{ fontSize: '14px' }}/>
                <button className="btn btn-warning px-4 fw-semibold text-white rounded-3 shadow-sm" style={{ background: '#f97316', border: 'none', fontSize: '13.5px' }} type="button">
                    Join
                </button>
            </div>
          </div>
        </div>
    </div>

    <div style={{ borderTop: '1px solid #f1f5f9', backgroundColor: '#fafafa' }}>
        <div className="container py-3 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2" style={{ fontSize: '13px' }}>
            <p className="m-0 text-secondary text-center text-md-start">
                &copy; {currentYear} <span className="fw-semibold text-dark">FoodFlex</span>. All rights reserved.
            </p>

            <div className="d-flex gap-3 text-secondary">
                <span className="d-flex align-items-center gap-1"><i className="bi bi-shield-check text-success"></i> Secure Checkout</span>
            </div>
        </div>
    </div>

    <style>{`
      .custom-footer-link { position: relative;transition: color 0.2s ease;}
      .custom-footer-link:hover {color: #f97316 !important;}
      .custom-footer-link::after { content: ''; position: absolute; width: 0; height: 2px; bottom: -2px; left: 0; background-color: #f97316;transition: width 0.2s ease;}
      .custom-footer-link:hover::after {width: 100%;}
      .logout-nav-btn:hover { background-color: rgba(220, 53, 69, 0.08) !important;transform: scale(1.02);}
      .user-welcome-badge {box-shadow: 0 2px 8px rgba(0,0,0,0.02);}
      .step-card:hover {transform: translateY(-8px);box-shadow: 0 15px 35px rgba(15, 23, 42, 0.08) !important;background-color: #ffffff !important;}
      .custom-placeholder::placeholder {color: #94a3b8 !important;opacity: 1 !important;}
      @keyframes popIn { 0% { transform: translate(100%, -50%) scale(0.4); opacity: 0; } 80% { transform: translate(100%, -50%) scale(1.15); }100% { transform: translate(100%, -50%) scale(1); opacity: 1; }}
      .badge-pop-animation {animation: popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;}`}
    </style>
  </footer>
  </>
  )
}

export default PublicLayout;