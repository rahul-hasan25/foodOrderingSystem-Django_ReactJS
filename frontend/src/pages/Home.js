import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Home = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  return (
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
                  <Link to="/" className={`nav-link px-3 py-2 rounded-3 fw-semibold d-flex align-items-center gap-2 transition-all ${isActive('/') ? 'text-warning bg-warning bg-opacity-10' : 'text-secondary'}`}  style={{ fontSize: '14.5px', transition: 'all 0.2s' }}>
                      <i className="bi bi-house-door fs-5"></i> Home
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to="/menu" className={`nav-link px-3 py-2 rounded-3 fw-semibold d-flex align-items-center gap-2 transition-all ${isActive('/menu') ? 'text-warning bg-warning bg-opacity-10' : 'text-secondary'}`} style={{ fontSize: '14.5px', transition: 'all 0.2s' }}>
                      <i className="bi bi-journal-richtext fs-5"></i> Menu
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to="/track" className={`nav-link px-3 py-2 rounded-3 fw-semibold d-flex align-items-center gap-2 transition-all ${isActive('/track') ? 'text-warning bg-warning bg-opacity-10' : 'text-secondary'}`} style={{ fontSize: '14.5px', transition: 'all 0.2s' }}>
                      <i className="bi bi-geo-alt fs-5"></i> Track
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to="/register" className={`nav-link px-3 py-2 rounded-3 fw-semibold d-flex align-items-center gap-2 transition-all ${isActive('/register') ? 'text-warning bg-warning bg-opacity-10' : 'text-secondary'}`} style={{ fontSize: '14.5px', transition: 'all 0.2s' }}>
                      <i className="bi bi-person-plus fs-5"></i> Register
                  </Link>
                </li>

                <li className="nav-item me-lg-2">
                  <Link to="/login" className={`nav-link px-3 py-2 rounded-3 fw-semibold d-flex align-items-center gap-2 transition-all ${isActive('/login') ? 'text-warning bg-warning bg-opacity-10' : 'text-secondary'}`} style={{ fontSize: '14.5px', transition: 'all 0.2s' }}>
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
  )
}

export default Home
