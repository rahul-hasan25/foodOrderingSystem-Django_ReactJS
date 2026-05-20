import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      return toast.warning("Please fill out both entry fields.");
    }

    setIsLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/admin/login/", {
          username: username,
          password: password
      });

      if (response.data.success) {
          toast.success(response.data.message || "Login Successful!");
          localStorage.setItem("adminToken", "foodflex_auth_token_secure_stub"); 
          localStorage.setItem("adminUser", response.data.username);
          navigate("/admin-dashboard");
      }
    } catch (error) {
      console.error("API Connection Diagnostic Log:", error);
      if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
      } else {
          toast.error("Unable to link to server. Check your Django status.");
      }
    } finally {
        setIsLoading(false);
    }
  };
  return (
    <div className="container-fluid min-vh-100 d-flex p-0" style={{ backgroundColor: '#06080c', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="row g-0 w-100">
        <div className="col-lg-7 d-none d-lg-flex flex-column justify-content-between p-5 position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(6, 8, 12, 0.88) 0%, rgba(15, 11, 11, 0.93) 100%), url("https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center center', borderRight: '1px solid rgba(255, 255, 255, 0.03)'}}>
          <div className="position-absolute rounded-circle animate-pulse-slow" style={{ width: '500px', height: '500px', background: 'rgba(220, 38, 38, 0.12)', filter: 'blur(130px)', top: '-15%', left: '-10%' }}></div>
          <div className="position-absolute rounded-circle animate-pulse-reverse" style={{ width: '400px', height: '400px', background: 'rgba(16, 185, 129, 0.06)', filter: 'blur(100px)', bottom: '-5%', right: '5%' }}></div>
          <div className="d-flex align-items-center gap-3 position-relative z-3">
            <div className="rounded-3 d-flex align-items-center justify-content-center text-white shadow-lg express-logo-glow" style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)' }}>
              <i className="bi bi-lightning-charge-fill fs-4 text-warning"></i>
            </div>

            <span className="text-white fw-black tracking-tight fs-4" style={{ fontWeight: 900 }}>
                Food<span style={{ color: '#dc2626' }}>Express</span> <span className="text-white fw-normal small fs-6 ms-1 font-monospace" style={{ opacity: 0.5 }}>v2.4</span>
            </span>
          </div>

          <div className="my-auto position-relative z-3 ps-4" style={{ maxWidth: '580px' }}>
            <span className="badge border rounded-pill px-3 py-2 mb-3 fw-bold tracking-wider text-uppercase d-inline-flex align-items-center gap-2" style={{ fontSize: '10px', color: '#dc2626', borderColor: 'rgba(220, 38, 38, 0.25)', background: 'rgba(220, 38, 38, 0.06)' }}>
              <span className="live-indicator-dot"></span> System Engine Operations
            </span>

            <h1 className="display-4 text-white fw-black mb-3" style={{ fontWeight: 900, letterSpacing: '-1.5px', lineHeight: '1.15' }}>
                Accelerate your cloud kitchen grid.
            </h1>

            <p className="fs-5 lh-md mb-0" style={{ color: '#94a3b8', fontWeight: '400' }}>
                Manage lightning-fast delivery dispatches, dynamic logistics tables, update active menus instantly, and track systemic performance metrics across all zones.
            </p>
          </div>

          <div className="d-flex justify-content-between small text-muted position-relative z-3 font-monospace" style={{ opacity: 0.4 }}>
              <span className='text-white'>© 2026 FoodExpress Infrastructure Core.</span>
              <span className='text-white'><i className="bi bi-shield-fill-check text-success me-1"></i> Secured Shell Active</span>
          </div>
        </div>

        <div className="col-12 col-lg-5 d-flex flex-column justify-content-center align-items-center p-4 p-sm-5 position-relative" style={{ backgroundColor: '#0a0d14' }}>
          <div className="position-absolute rounded-circle d-lg-none" style={{ width: '250px', height: '250px', background: 'rgba(220, 38, 38, 0.08)', filter: 'blur(90px)', top: '5%', right: '5%' }}></div>
  
          <div className="w-100 position-relative z-3" style={{ maxWidth: '400px' }}>
            <div className="mb-5 text-center text-lg-start">
              <div className="d-lg-none rounded-3 d-inline-flex align-items-center justify-content-center text-white mb-3 shadow-lg" style={{ width: '50px', height: '50px', background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)' }}>
                <i className="bi bi-lightning-charge-fill fs-4 text-warning"></i>
              </div>

              <h2 className="text-white fw-black mb-1" style={{ fontWeight: 800, letterSpacing: '-0.5px', fontSize: '1.85rem' }}>
                  Admin Gateway
              </h2>

              <p style={{ color: '#475569', fontSize: '14.5px', fontWeight: '500' }}>Provide security credentials to unlock server terminal.</p>
            </div>

            <form onSubmit={handleFormSubmit} className="d-flex flex-column gap-4">
              <div className="form-group">
                <label htmlFor="foodexpress-username" className="text-white-50 small fw-bold mb-2 d-block tracking-wider" style={{ fontSize: '11px', textTransform: 'uppercase' }}>
                  System Administrator ID
                </label>
                <div className="input-group express-input-field">
                  <span className="input-group-text border-0 ps-3 bg-transparent text-secondary">
                    <i className="bi bi-person-circle fs-5"></i>
                  </span>
                  <input id="foodexpress-username" name="username" type="text" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username or operator identifier" className="form-control border-0 text-white bg-transparent shadow-none" style={{ height: '54px', fontSize: '14.5px' }}/>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="foodexpress-password" className="text-white-50 small fw-bold mb-2 d-block tracking-wider" style={{ fontSize: '11px', textTransform: 'uppercase' }}>
                  Secure Encrypted Password
                </label>
                <div className="input-group express-input-field">
                  <span className="input-group-text border-0 ps-3 bg-transparent text-secondary">
                    <i className="bi bi-shield-lock-fill fs-5"></i>
                  </span>
                  <input id="foodexpress-password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••••••••" className="form-control border-0 text-white bg-transparent shadow-none" style={{ height: '54px', fontSize: '14.5px' }}/>
                  <span className="input-group-text border-0 pe-3 bg-transparent text-secondary express-password-eye" onClick={() => setShowPassword(!showPassword)} >
                      <i className={showPassword ? "bi bi-eye-slash-fill fs-5" : "bi bi-eye-fill fs-5"}></i>
                  </span>
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="btn w-100 fw-bold border-0 mt-2 d-flex justify-content-center align-items-center tracking-wide express-btn-effect" style={{ height: '54px', borderRadius: '12px', background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)', color: '#ffffff', fontSize: '15px' }}>
                {isLoading ? (
                    <span className="spinner-border spinner-border-sm text-white" role="status"></span>
                ) : (
                    <>
                      <span className="align-middle">Authenticate System</span>
                      <i className="bi bi-chevron-right ms-1 small align-middle fw-bold"></i>
                    </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .express-logo-glow {box-shadow: 0 0 20px rgba(220, 38, 38, 0.45) !important;}
        .express-input-field { border: 1px solid rgba(255, 255, 255, 0.05); background: rgba(15, 22, 36, 0.65); border-radius: 12px; overflow: hidden; transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);}
        .express-input-field:focus-within {border-color: #dc2626 !important; box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.14) !important;background: rgba(15, 22, 36, 0.95) !important;}
        .express-input-field:focus-within .bi { color: #dc2626 !important;}
        .express-input-field input { color: #ffffff !important; }
        .express-input-field input::placeholder { color: #334155 !important; }
        .express-password-eye { cursor: pointer; transition: color 0.2s ease; }
        .express-password-eye:hover .bi { color: #cbd5e1 !important; }
        .express-btn-effect {transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);box-shadow: 0 4px 14px rgba(220, 38, 38, 0.25);}
        .express-btn-effect:hover:not([disabled]) {transform: translateY(-1px);box-shadow: 0 12px 26px -4px rgba(220, 38, 38, 0.5) !important;filter: brightness(1.08);}
        .express-btn-effect:active:not([disabled]) { transform: translateY(1px); }
        .live-indicator-dot {width: 7px;height: 7px;background-color: #10b981;border-radius: 50%;display: inline-block;box-shadow: 0 0 8px #10b981;animation: blink 1.8s infinite ease-in-out;}

        @keyframes blink { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
        @keyframes pulseSlow { 0%, 100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.04); opacity: 1; } }
        @keyframes pulseReverse { 0%, 100% { transform: scale(1.04); opacity: 0.7; } 50% { transform: scale(1); opacity: 0.9; } }
            
        .animate-pulse-slow { animation: pulseSlow 9s infinite ease-in-out; }
        .animate-pulse-reverse { animation: pulseReverse 8s infinite ease-in-out; }`}
      </style>
    </div>
  )
}

export default AdminLogin
