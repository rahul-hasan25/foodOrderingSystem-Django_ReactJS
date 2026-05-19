import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import PublicLayout from './PublicLayout';

const UserRegister = () => {
    const [formData, setFormData] = useState({
        first_name      : '',
        last_name       : '',
        email           : '',
        mobile          : '',
        password        : '',
        repeat_password : ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.repeat_password) {
            setErrors({
                repeat_password: ["Passwords do not match! Please try again."]
            });
            setLoading(false);
            return;
        }
        setLoading(true);
        setErrors({});
        setSuccessMsg('');

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/user/register/', formData);
            if (response.data.success) {
                setSuccessMsg(response.data.message);
                setTimeout(() => navigate('/login'), 2500);
            }
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                alert("Server error! Please check if your Django server is running.");
            }
        } finally {
            setLoading(false);
        }
    };
  return (
    <PublicLayout>
        <div className="d-flex align-items-center justify-content-center px-2" style={{minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: "'Poppins', sans-serif", backgroundImage: 'radial-gradient(#f9731605 2px, transparent 2px)', backgroundSize: '30px 30px'}}> 
            <div className="container my-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-10 col-xl-9">
                        <div className="card border-0 rounded-4 overflow-hidden shadow-lg" style={{ minHeight: '600px' }}>
                            <div className="row g-0" style={{ minHeight: '600px' }}>                                
                                <div className="col-md-5 d-none d-md-flex flex-column justify-content-between p-5 position-relative text-white" style={{ backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.55), rgba(234, 88, 12, 0.5)), url("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1760&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center' }}>                                    
                                    <div>
                                        <h4 className="fw-bold tracking-tight m-0">
                                            Food<span style={{ color: '#f97316' }}>Flex</span>
                                        </h4>
                                    </div>

                                    <div className="mt-auto">
                                        <h3 className="fw-extrabold lh-sm mb-2" style={{ fontWeight: '800' }}>Taste the Premium Life.</h3>
                                        <p className="small opacity-75 m-0 lh-base">Discover dishes crafted to perfection. Your personalized gourmet experience begins here.</p>
                                    </div>
                                </div>

                                <div className="col-12 col-md-7 bg-white p-4 p-sm-5 d-flex flex-column justify-content-center">
                                    <div className="mb-4">
                                        <h3 className="fw-bold text-dark mb-1" style={{ letterSpacing: '-0.5px' }}>Create Account</h3>
                                        <p className="text-secondary small">Join us to enjoy unlimited hot deliveries and rewards.</p>
                                    </div>

                                    {successMsg && (
                                        <div className="alert alert-success border-0 rounded-3 p-3 small d-flex align-items-center gap-2 mb-4" role="alert">
                                            <i className="bi bi-patch-check-fill fs-5 text-success"></i> {successMsg}
                                        </div>
                                    )}

                                    <form onSubmit={handleFormSubmit} className="d-flex flex-column gap-3">
                                        <div className="row g-2">
                                            <div className="col-12 col-sm-6">
                                                <label className="form-label small fw-semibold text-secondary mb-1">First Name</label>
                                                <input type="text" name="first_name" required className="custom-placeholder form-control px-3 py-2.5 rounded-3 bg-light border-0 aesthetic-input" placeholder="Rahul" value={formData.first_name} onChange={handleInputChange} />
                                            </div>
                                            <div className="col-12 col-sm-6">
                                                <label className="form-label small fw-semibold text-secondary mb-1">Last Name</label>
                                                <input type="text" name="last_name" required className="custom-placeholder form-control px-3 py-2.5 rounded-3 bg-light border-0 aesthetic-input" placeholder="Hasan" value={formData.last_name} onChange={handleInputChange} />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="form-label small fw-semibold text-secondary mb-1">Email Address</label>
                                            <input type="email" name="email" required className={`custom-placeholder form-control px-3 py-2.5 rounded-3 bg-light border-0 aesthetic-input ${errors.email ? 'is-invalid' : ''}`} placeholder="rahul@example.com" value={formData.email} onChange={handleInputChange} />
                                            {errors.email && <div className="invalid-feedback small mt-1">{errors.email[0]}</div>}
                                        </div>

                                        <div>
                                            <label className="form-label small fw-semibold text-secondary mb-1">Mobile Number</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-0 text-muted px-3" style={{ borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px', fontSize: '14px' }}>+880</span>
                                                <input type="tel" name="mobile" required className={`custom-placeholder form-control px-3 py-2.5 bg-light border-0 aesthetic-input ${errors.mobile ? 'is-invalid' : ''}`} style={{ borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }} placeholder="1712345678" value={formData.mobile} onChange={handleInputChange} />
                                            </div>
                                            {errors.mobile && <div className="text-danger opacity-75 tiny-err-text mt-1">{errors.mobile[0]}</div>}
                                        </div>

                                        <div>
                                            <label className="form-label small fw-semibold text-secondary mb-1">Secure Password</label>
                                            <input type="password" name="password" required className={`custom-placeholder form-control px-3 py-2.5 rounded-3 bg-light border-0 aesthetic-input ${errors.password ? 'is-invalid' : ''}`} placeholder="••••••••" value={formData.password} onChange={handleInputChange} />
                                            {errors.password && <div className="invalid-feedback small mt-1">{errors.password[0]}</div>}
                                        </div>

                                        <div>
                                            <label className="form-label small fw-semibold text-secondary mb-1">Confirm Password</label>
                                            <input type="password" name="repeat_password" required className={`custom-placeholder form-control px-3 py-2.5 rounded-3 bg-light border-0 aesthetic-input ${errors.repeat_password ? 'is-invalid' : ''}`} placeholder="••••••••" value={formData.repeat_password} onChange={handleInputChange} />
                                            {errors.repeat_password && <div className="invalid-feedback small mt-1">{errors.repeat_password[0]}</div>}
                                        </div>

                                        <button type="submit" disabled={loading} className="btn fw-bold py-2.5 rounded-3 text-white shadow-sm mt-3 aesthetic-btn" style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', border: 'none',fontSize: '15px'}}>
                                            {loading ? (
                                                <div className="spinner-border spinner-border-sm" role="status"></div>
                                            ) : "Create My Account"}
                                        </button>
                                    </form>

                                    <div className="text-center mt-4">
                                        <p className="small text-secondary mb-0">
                                            Already a member? <Link to="/login" className="fw-bold text-decoration-none ms-1" style={{ color: '#f97316' }}>Sign In</Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .aesthetic-input {transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);font-size: 14px;}
                .aesthetic-input:focus { background-color: #fff !important;box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.12) !important;border: 1px solid #f97316 !important;}
                .aesthetic-btn {transition: all 0.3s ease;}
                .aesthetic-btn:hover { box-shadow: 0 8px 20px rgba(249, 115, 22, 0.35) !important;transform: translateY(-1px);opacity: 0.95;}
                .tiny-err-text {font-size: 12px;}
                .custom-placeholder::placeholder {color: #94a3b8 !important;opacity: 1 !important;}`}
            </style>
        </div>
    </PublicLayout>
  )
}

export default UserRegister
