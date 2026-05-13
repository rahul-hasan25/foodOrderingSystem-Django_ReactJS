import React, { useState } from 'react'
import { Link } from "react-router-dom";
import '../styles/adminlogin.css'

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <div className="d-flex justify-content-center align-items-center" style={{minHeight: "100vh", background: "linear-gradient(135deg, #0f172a, #111827, #1e293b)"}}>
        <div className="card border-0 p-4" style={{width: "100%", maxWidth: "420px", borderRadius: "24px", background: "rgba(255,255,255,0.08)", backdropFilter: "blur(15px)", boxShadow: "0 10px 40px rgba(0,0,0,0.4)"}}>
            {/* Top Icon */}
            <div className="text-center mb-4">
                <div className="mx-auto d-flex justify-content-center align-items-center" style={{ width: "90px", height: "90px", borderRadius: "50%", background: "rgba(255,255,255,0.12)"}}>
                    <i className="bi bi-shield-lock-fill text-white" style={{ fontSize: "42px" }}></i>
                </div>

                <h2 className="text-white fw-bold mt-4"> Admin Login </h2>

                <p style={{ color: "#cbd5e1", fontSize: "15px"}}> Welcome back! Please login to continue. </p>
            </div>

            {/* Form */}
            <form>
                <div className="mb-3">
                  <label className="text-white mb-2"> Username </label>
                  <div className="input-group">
                    <span className="input-group-text border-0" style={{ background: "#1e293b", color: "white" }} >
                        <i className="bi bi-person-fill"></i>
                    </span>

                    <input type="text" className="form-control border-0 text-white" placeholder="Enter Username" style={{background: "rgba(255,255,255,0.12)", height: "50px", color:'white' }} />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-white mb-2">Password</label>
                  <div className="input-group">
                    <span className="input-group-text border-0" style={{ background: "#1e293b", color: "white" }}>
                      <i className="bi bi-lock-fill"></i>
                    </span>

                    <input type={showPassword ? "text" : "password"} className="form-control border-0 text-white" placeholder="Enter Password" style={{ background: "rgba(255,255,255,0.12)", height: "50px", color:'white' }} />
                    <span className="input-group-text border-0" onClick={() => setShowPassword(!showPassword)} style={{ background: "#1e293b", color: "white", cursor: "pointer" }} >
                      <i className={showPassword ? "bi bi-eye-slash-fill" : "bi bi-eye-fill" } ></i>
                    </span>
                  </div>
                </div>

                <button type="submit" className="btn w-100 text-white fw-bold" style={{ height: "50px", borderRadius: "14px", background: "linear-gradient(135deg, #3b82f6, #2563eb)", border: "none", fontSize: "16px" }}>
                    <i className="bi bi-box-arrow-in-right me-2"></i> Login
                </button>
            </form>

            <div className="d-flex justify-content-center align-items-center gap-1 mt-4">
              <p className="mb-0" style={{ color: "#cbd5e1", fontSize: "14px" }} > Don’t have an account? </p>
              <Link to="/signup" className="text-decoration-none fw-bold" style={{ color: "#60a5fa", fontSize: "15px", transition: "0.3s"  }} >
                SignUp
              </Link>
          </div>
        </div>
    </div>
  )
}

export default AdminLogin
