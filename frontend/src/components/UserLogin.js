import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import PublicLayout from './PublicLayout';
import { toast } from 'react-toastify';


const UserLogin = () => {
    const [identity, setIdentity] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login/', {
                identity: identity,
                password: password
            });

            if (response.data.success) {
                const userData = response.data.user;
                localStorage.setItem('userId', userData.id);
                localStorage.setItem('userName', userData.first_name);
                localStorage.setItem('user', JSON.stringify(userData));
                
                toast.success(response.data.message);

                setTimeout(() => {
                    window.location.href = '/'; 
                }, 1500);
            }
        } catch (err) {
            const errMsg = err.response && err.response.data ? err.response.data.message : "Connection lost! Please check your backend server.";
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };
  return (
    <PublicLayout>
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', fontFamily: "'Poppins', sans-serif" }}>            
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-10 col-xl-9">
                        <div className="card border-0 rounded-4 overflow-hidden shadow-lg" style={{ minHeight: '550px' }}>
                            <div className="row g-0" style={{ minHeight: '550px' }}>
                                <div className="col-md-5 d-none d-md-flex flex-column justify-content-between p-5 position-relative text-white" style={{ backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.65), rgba(249, 115, 22, 0.5)), url("https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1770&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center'}}>
                                    <div>
                                        <h4 className="fw-bold m-0 tracking-tight">
                                            Food<span style={{ color: '#f97316' }}>Flex</span>
                                        </h4>
                                    </div>

                                    <div className="mt-auto bg-white bg-opacity-10 backdrop-blur p-4 rounded-4" style={{ backdropFilter: 'blur(8px)' }}>
                                        <h4 className="fw-extrabold mb-2" style={{ fontWeight: '800' }}>Your Favorite Foods, Just A Click Away.</h4>
                                        <p className="small opacity-90 m-0">Log in to track your current orders and explore exclusive tailored menus.</p>
                                    </div>
                                </div>
                                
                                <div className="col-12 col-md-7 bg-white p-4 p-sm-5 d-flex flex-column justify-content-center">
                                    <div className="mb-4">
                                        <h3 className="fw-bold text-dark mb-1" style={{ letterSpacing: '-0.5px' }}>Welcome Back</h3>
                                        <p className="text-secondary small">Please enter your credentials to access your account.</p>
                                    </div>

                                    <form onSubmit={handleLoginSubmit} className="d-flex flex-column gap-3.5">
                                        <div>
                                            <label className="form-label small fw-semibold text-secondary mb-1">Email or Mobile Number</label>
                                            <div className="input-group rounded-3 overflow-hidden" style={{ border: '1px solid #e2e8f0' }}>
                                                <span className="input-group-text bg-light border-0 text-muted px-3"><i className="bi bi-person-badge-fill"></i></span>
                                                <input type="text" required className="custom-placeholder form-control bg-light border-0 premium-input" placeholder="example@mail.com or 017xxxxxxxx" value={identity} onChange={(e) => setIdentity(e.target.value)} style={{ height: '48px', fontSize: '14px' }}/>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <label className="form-label small fw-semibold text-secondary m-0">Password</label>
                                                <Link to="/forgot-password" className="text-decoration-none tiny-link" style={{ color: '#f97316', fontSize: '12px' }}>Forgot Password?</Link>
                                            </div>
                                            <div className="input-group rounded-3 overflow-hidden" style={{ border: '1px solid #e2e8f0' }}>
                                                <span className="input-group-text bg-light border-0 text-muted px-3"><i className="bi bi-lock-fill"></i></span>
                                                <input type={showPassword ? "text" : "password"} required className="custom-placeholder form-control bg-light border-0 premium-input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={{ height: '48px', fontSize: '14px' }}/>
                                                <span className="input-group-text bg-light border-0 text-muted px-3" onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>
                                                    <i className={showPassword ? "bi bi-eye-slash-fill" : "bi bi-eye-fill"}></i>
                                                </span>
                                            </div>
                                        </div>

                                        
                                        <button type="submit" disabled={loading} className="btn fw-bold py-2.5 rounded-3 text-white shadow-sm mt-3 premium-btn" style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)',border: 'none',fontSize: '15px', height: '48px'}}>
                                            {loading ? (
                                                <div className="spinner-border spinner-border-sm" role="status"></div>
                                            ) : "Sign In"}
                                        </button>
                                    </form>
                                  
                                    <div className="text-center mt-4">
                                        <p className="small text-secondary mb-0">
                                            New to FoodFlex? <Link to="/user/register" className="fw-bold text-decoration-none ms-1" style={{ color: '#f97316' }}>Create an account</Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>{`
                .premium-input {transition: all 0.2s ease;}
                .premium-input:focus {background-color: #fff !important;box-shadow: none !important;}
                .input-group:focus-within {border-color: #f97316 !important;box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.15) !important;}
                .premium-btn {transition: all 0.3s ease;}
                .premium-btn:hover {box-shadow: 0 8px 22px rgba(249, 115, 22, 0.35) !important;transform: translateY(-1px);opacity: 0.95; }
                .tiny-link:hover {text-decoration: underline !important;}
                .custom-placeholder::placeholder {color: #94a3b8 !important;opacity: 1 !important;}`}
            </style>
        </div>
    </PublicLayout>
  )
}

export default UserLogin
