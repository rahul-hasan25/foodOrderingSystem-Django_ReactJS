import React, { useState } from 'react'
import { toast } from "react-toastify"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import '../styles/adminlogin.css'
import PublicLayout from '../components/PublicLayout'

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async(e)=> {
    e.preventDefault();

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/admin-login/", {username,password});
      if (res.data.success){
          toast.success(res.data.message || "Login Successful!")
          localStorage.setItem("adminUser", res.data.username);
          navigate("/admin-dashboard");
      }
      else {
          toast.error(res.data.message || "Invalid Credentials")
      }
    }
    catch(err) {
      console.error(err);
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Invalid Credentials");
      }
    }
  }
  return (
    <PublicLayout>
      <div className="d-flex justify-content-center align-items-center position-relative overflow-hidden" 
     style={{ minHeight: "100vh", background: "linear-gradient(135deg, #090d16, #0f172a, #1e293b)", fontFamily: "'Poppins', sans-serif" }}>
    
    <div className="position-absolute rounded-circle" style={{ width: "300px", height: "300px", background: "rgba(59, 130, 246, 0.15)", filter: "blur(80px)", top: "10%", left: "15%" }}></div>
    <div className="position-absolute rounded-circle" style={{ width: "250px", height: "250px", background: "rgba(147, 51, 234, 0.12)", filter: "blur(80px)", bottom: "15%", right: "15%" }}></div>

    <div className="card p-4 p-sm-5 position-relative admin-glass-card" 
         style={{ 
             width: "100%", 
             maxWidth: "440px", 
             borderRadius: "28px", 
             background: "rgba(255, 255, 255, 0.03)", 
             backdropFilter: "blur(20px)", 
             WebkitBackdropFilter: "blur(20px)",
             border: "1px solid rgba(255, 255, 255, 0.08)", 
             boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
         }}>

        <div className="text-center mb-4">
            <div className="mx-auto d-flex justify-content-center align-items-center position-relative admin-icon-wrapper" 
                 style={{ 
                     width: "85px", 
                     height: "85px", 
                     borderRadius: "24px", 
                     background: "linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))",
                     border: "1px solid rgba(255, 255, 255, 0.15)",
                     transform: "rotate(45deg)",
                     transition: "all 0.4s ease"
                 }}>
                <i className="bi bi-shield-lock-fill text-white" style={{ fontSize: "36px", transform: "rotate(-45deg)" }}></i>
            </div>

            <h2 className="text-white fw-extrabold mt-4 mb-2 h3" style={{ letterSpacing: "-0.5px" }}> 
                Admin <span style={{ background: "linear-gradient(135deg, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Portal</span> 
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "14px", fontWeight: "400" }}> Welcome back! Sign in to manage your system. </p>
        </div>

        <form onSubmit={handleLogin} className="d-flex flex-column gap-3.5">
            <div className="form-group-custom">
                <label className="text-white opacity-75 mb-2 small fw-medium" style={{ letterSpacing: "0.5px" }}>Username</label>
                <div className="input-group rounded-3 overflow-hidden" style={{ border: "1px solid rgba(255, 255, 255, 0.08)", background: "rgba(15, 23, 42, 0.6)" }}>
                    <span className="input-group-text border-0 ps-3 bg-transparent" style={{ color: "#64748b" }} >
                        <i className="bi bi-person-fill fs-5"></i>
                    </span>
                    <input 
                        onChange={(e)=>setUsername(e.target.value)} 
                        value={username} 
                        type="text" 
                        className="form-control border-0 text-white bg-transparent admin-input" 
                        placeholder="Enter admin username" 
                        style={{ height: "52px", fontSize: "14px", boxShadow: "none" }} 
                    />
                </div>
            </div>

            <div className="form-group-custom mt-3">
                <label className="text-white opacity-75 mb-2 small fw-medium" style={{ letterSpacing: "0.5px" }}>Password</label>
                <div className="input-group rounded-3 overflow-hidden" style={{ border: "1px solid rgba(255, 255, 255, 0.08)", background: "rgba(15, 23, 42, 0.6)" }}>
                    <span className="input-group-text border-0 ps-3 bg-transparent" style={{ color: "#64748b" }}>
                        <i className="bi bi-lock-fill fs-5"></i>
                    </span>
                    <input 
                        onChange={(e)=>setPassword(e.target.value)} 
                        value={password} 
                        type={showPassword ? "text" : "password"} 
                        className="form-control border-0 text-white bg-transparent admin-input" 
                        placeholder="Enter secure password" 
                        style={{ height: "52px", fontSize: "14px", boxShadow: "none" }} 
                    />
                    <span className="input-group-text border-0 pe-3 bg-transparent" onClick={() => setShowPassword(!showPassword)} style={{ color: "#64748b", cursor: "pointer" }} >
                        <i className={showPassword ? "bi bi-eye-slash-fill fs-5" : "bi bi-eye-fill fs-5" } ></i>
                    </span>
                </div>
            </div>

            <button type="submit" className="btn w-100 text-white fw-bold mt-4 position-relative overflow-hidden admin-submit-btn" 
                    style={{ 
                        height: "52px", 
                        borderRadius: "12px", 
                        background: "linear-gradient(135deg, #2563eb, #7c3aed)", 
                        border: "none", 
                        fontSize: "15px",
                        letterSpacing: '0.5px',
                        transition: "all 0.3s ease"
                    }}>
                <i className="bi bi-box-arrow-in-right me-2 fs-5 align-middle"></i> 
                <span className="align-middle">Authenticate</span>
            </button>
        </form>
    </div>

    <style>{`
        .admin-glass-card {
            transition: border 0.3s ease, box-shadow 0.3s ease;
        }
        .admin-glass-card:hover {
            border-color: rgba(59, 130, 246, 0.2) !important;
            box-shadow: 0 30px 60px -12px rgba(59, 130, 246, 0.12) !important;
        }
        .admin-glass-card:hover .admin-icon-wrapper {
            transform: rotate(45deg) scale(1.05);
            border-color: rgba(147, 51, 234, 0.4) !important;
            box-shadow: 0 0 20px rgba(147, 51, 234, 0.2);
        }
        .admin-input::placeholder {
            color: #475569 !important;
        }
        .input-group:focus-within {
            border-color: rgba(59, 130, 246, 0.5) !important;
            box-shadow: 0 0 12px rgba(59, 130, 246, 0.15);
        }
        .input-group:focus-within .input-group-text {
            color: #3b82f6 !important;
        }
        .admin-submit-btn:hover {
            box-shadow: 0 0 25px rgba(124, 58, 237, 0.45);
            transform: translateY(-1px);
            opacity: 0.95;
        }
        .admin-submit-btn:active {
            transform: translateY(1px);
        }
    `}</style>
</div>
    </PublicLayout>
  )
}

export default AdminLogin
