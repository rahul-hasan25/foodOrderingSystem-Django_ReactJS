import React from 'react'
import { Link, useNavigate } from 'react-router-dom';

const AdminHeader = ({toggleSidebar, sidebarOpen}) => {
  const navigate = useNavigate();

  const handleNotificationClick = () => {
    alert('Notifications clicked!');
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminToken'); 
    navigate('/', { replace: true });
  };
  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.3/font/bootstrap-icons.min.css" />
      <nav className="navbar navbar-expand-lg bg-white w-100 px-4 shadow-sm" style={{ borderBottom: '1px solid #e2e8f0', paddingTop: '8px', paddingBottom: '8px'}}>
        <div className="container-fluid p-0">
          <Link to='/' className="navbar-brand d-flex align-items-center gap-2" style={{ textDecoration: 'none' }}>
            <button onClick={toggleSidebar} className="btn btn-outline-secondary me-2">
              <i className="bi bi-text-left fs-5"></i>
            </button>

            <div className="d-flex align-items-center justify-content-center rounded-circle text-white" style={{ width: '40px', height: '40px', fontSize: '20px', background: 'linear-gradient(135deg, #f97316 0%, #ffa14a 100%)', boxShadow: '0 4px 12px rgba(249, 115, 22, 0.2)'}}>
              <i className="bi bi-egg-fried"></i>
            </div>
            <span className="fw-bold tracking-wide" style={{ color: '#0f172a', fontSize: '20px' }}>
              Food<span style={{ color: '#f97316' }}>Express</span>
            </span>
          </Link>

          <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-end" id="navbarContent">
            <div className="d-flex align-items-lg-center align-items-start flex-column flex-lg-row gap-2 mt-3 mt-lg-0">
              <button className="btn position-relative p-2 d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', transition: 'all 0.2s'}} onClick={handleNotificationClick} title="Notifications" onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}>
                <i className="bi bi-bell-fill fs-5" style={{ color: '#64748b' }}></i>
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '10px', border: '2px solid #fff' }}>
                  
                </span>
              </button>

              <button className="btn d-flex align-items-center gap-2 px-3 py-2 fw-medium" onClick={handleLogoutClick} style={{ fontSize: '14px', backgroundColor: '#fef2f2',color: '#ef4444', border: '1px solid #fca5a5', transition: 'all 0.2s'}} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fee2e2'; e.currentTarget.style.color = '#dc2626';}} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fef2f2'; e.currentTarget.style.color = '#ef4444';}}>
                <i className="bi bi-box-arrow-right fs-6"></i>
                <span>Logout</span>
              </button>

            </div>
          </div>

        </div>
      </nav>
    </>
  )
}

export default AdminHeader
