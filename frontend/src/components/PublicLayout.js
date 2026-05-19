import React from 'react'
import { Link, useLocation } from 'react-router-dom';

const PublicLayout = ({children}) => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    const currentYear = new Date().getFullYear();
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

              <li className="nav-item">
                <Link to="/register" className={`nav-link px-2 py-2 rounded-3 fw-semibold d-flex align-items-center gap-1 transition-all ${isActive('/register') ? 'text-warning bg-warning bg-opacity-10' : 'text-secondary'}`} style={{ fontSize: '14.5px', transition: 'all 0.2s' }}>
                    <i className="bi bi-person-plus fs-5"></i> Register
                </Link>
              </li>

              <li className="nav-item me-lg-2">
                <Link to="/login" className={`nav-link px-2 py-2 rounded-3 fw-semibold d-flex align-items-center gap-1 transition-all ${isActive('/login') ? 'text-warning bg-warning bg-opacity-10' : 'text-secondary'}`} style={{ fontSize: '14.5px', transition: 'all 0.2s' }}>
                    <i className="bi bi-box-arrow-in-right fs-5"></i> Login
                </Link>
              </li>

              <li className="nav-item mt-2 mt-lg-0">
                <Link to="/admin" className="nav-link px-4 py-2 rounded-3 fw-semibold text-white d-flex align-items-center justify-content-center gap-2 shadow-sm" style={{ fontSize: '14px', backgroundColor: '#1e293b',  border: 'none', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0f172a'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}>
                    <i className="bi bi-speedometer2"></i> Admin Panel
                </Link>
              </li>
            </ul>
          </div>
      </div>
  </nav>

    <div>{children}</div>

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
                    <input type="email" className="form-control bg-transparent border-0 shadow-none ps-3 py-2 text-dark" placeholder="Your email..."  style={{ fontSize: '14px' }}/>
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
          .custom-footer-link:hover::after {width: 100%;}`}
        </style>
  </footer>
  </>
  )
}

export default PublicLayout
