import React, { useState, useEffect } from 'react';
import PublicLayout from './../components/PublicLayout';

const UserMyProfile = () => {
  const userId = localStorage.getItem('userId');

  const [profileData, setProfileData] = useState(null);
  const [activeTab, setActiveTab] = useState('personal-info');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    mobile: ''
  });

  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    if (userId) {
      fetchProfileDetails();
    } else {
      setIsLoading(false);
      showAlert(true, 'danger', 'User identification session active data missing. Please log in.');
    }
  }, [userId]);

  const fetchProfileDetails = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/user/profile/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId
        }
      });
      const data = await response.json();
      if (response.ok) {
        setProfileData(data);
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          mobile: data.mobile ? String(data.mobile) : ''
        });
      } else {
        showAlert(true, 'danger', 'Failed to retrieve profile records.');
      }
    } catch (err) {
      showAlert(true, 'danger', 'Server pipeline communication failure.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const showAlert = (show, type, message) => {
    setAlert({ show, type, message });
    if (show) setTimeout(() => setAlert({ show: false, type: '', message: '' }), 6000);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      // FIX: Clean mobile format before transmitting to avoid ValueError anomalies on backend
      const sanitizedPayload = {
        first_name: formData.first_name.strip ? formData.first_name.strip() : formData.first_name,
        last_name: formData.last_name.strip ? formData.last_name.strip() : formData.last_name,
        mobile: formData.mobile.replace(/\D/g, '') // Strips out any characters or white spaces
      };

      const response = await fetch('http://127.0.0.1:8000/api/user/profile/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId
        },
        body: JSON.stringify(sanitizedPayload)
      });
      const resData = await response.json();
      
      if (response.ok) {
        // FIX: Synchronized state target to read standard payload signature returned by DRF
        setProfileData(resData);
        setIsEditing(false);
        showAlert(true, 'success', 'Your profile info has been updated successfully!');
      } else {
        showAlert(true, 'danger', resData.error || 'Invalid parameters parsed. Check input format.');
      }
    } catch (err) {
      showAlert(true, 'danger', 'Could not apply update changes to database.');
    }
  };

  // Helper calculation function to pull initialization tokens safely without rendering runtime crashes
  const getUserInitials = () => {
    if (!profileData) return 'U';
    const first = profileData.first_name ? profileData.first_name[0] : '';
    const last = profileData.last_name ? profileData.last_name[0] : '';
    return (first + last).toUpperCase() || 'U';
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="spinner-border text-warning" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading Profile...</span>
        </div>
      </div>
    );
  }

  return (
    <PublicLayout>
        <div className="container py-5" style={{ background: '#f8f9fa', minHeight: '100vh' }}>

            {alert.show && (
                <div 
                    className={`alert alert-${alert.type} alert-dismissible fade show position-fixed shadow-lg border-0 rounded-3 z-3 mt-5`} 
                    role="alert"
                    style={{
                      top: '24px',
                      right: '24px',
                      minWidth: '320px',
                      maxWidth: '400px',
                      zIndex: 9999,
                      animation: 'slideIn 0.3s ease-out'
                    }}
                >
                    <div className="d-flex align-items-center gap-2">
                    <span style={{ fontSize: '1.2rem' }}>
                        {alert.type === 'success' ? '✨' : '⚠️'}
                    </span>
                    <div>
                        <strong className="d-block text-capitalize">{alert.type}!</strong>
                        <span className="small text-secondary">{alert.message}</span>
                    </div>
                    </div>
                    <button 
                    type="button" 
                    className="btn-close small ms-auto" 
                    onClick={() => setAlert({ ...alert, show: false })}
                    aria-label="Close"
                    ></button>
                </div>
            )}

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white">
                <div className="p-5 text-white position-relative" style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)' }}>
                    <div className="d-flex flex-column flex-md-row align-items-center gap-4 position-relative z-1">
                        <div className="rounded-circle bg-white text-dark d-flex align-items-center justify-content-center shadow-lg border border-3 border-light" style={{ width: '100px', height: '100px', fontSize: '2.5rem', fontWeight: 'bold', minWidth: '100px' }}>
                            {getUserInitials()}
                        </div>
                        <div className="text-center text-md-start">
                            <h2 className="fw-bold mb-1">{profileData?.first_name} {profileData?.last_name}</h2>
                            <p className="mb-2 opacity-75"><i className="bi bi-envelope"></i> {profileData?.email}</p>
                            {profileData?.reg_date && (
                              <span className="badge bg-white bg-opacity-25 rounded-pill px-3 py-2 text-white">
                                  Member Since: {new Date(profileData.reg_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                              </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Dynamic Engagement Dashboard Row */}
                <div className="row g-0 text-center border-top bg-light">
                    <div className="col-4 border-end py-4">
                        <h3 className="fw-bold text-dark mb-0">{profileData?.total_orders_placed || 0}</h3>
                        <small className="text-muted text-uppercase tracking-wider fw-semibold" style={{ fontSize: '0.75rem' }}>Orders Placed</small>
                    </div>
                    <div className="col-4 border-end py-4">
                        <h3 className="fw-bold text-success mb-0">${profileData?.total_amount_spent ? Number(profileData.total_amount_spent).toFixed(2) : "0.00"}</h3>
                        <small className="text-muted text-uppercase tracking-wider fw-semibold" style={{ fontSize: '0.75rem' }}>Total Spent</small>
                    </div>
                    <div className="col-4 py-4">
                        <h3 className="fw-bold text-warning mb-0">{profileData?.reviews_written_count || 0}</h3>
                        <small className="text-muted text-uppercase tracking-wider fw-semibold" style={{ fontSize: '0.75rem' }}>Reviews Written</small>
                    </div>
                </div>
            </div>

            {/* Main Grid Section */}
            <div className="row g-4">
                <div className="col-lg-3">
                    <div className="list-group border-0 shadow-sm rounded-4 overflow-hidden p-2 bg-white">
                        <button type="button" onClick={() => setActiveTab('personal-info')} className={`list-group-item list-group-item-action border-0 rounded-3 py-3 px-4 mb-1 fw-medium text-start ${activeTab === 'personal-info' ? 'bg-warning bg-opacity-10 text-dark border-start border-4 border-warning' : 'text-secondary'}`}>
                            👤 Account Details
                        </button>
                        <button type="button" onClick={() => setActiveTab('saved-addresses')} className={`list-group-item list-group-item-action border-0 rounded-3 py-3 px-4 text-start fw-medium ${activeTab === 'saved-addresses' ? 'bg-warning bg-opacity-10 text-dark border-start border-4 border-warning' : 'text-secondary'}`}>
                            📍 Saved Addresses
                        </button>
                    </div>
                </div>

                {/* Dynamic View Display Column */}
                <div className="col-lg-9">
                    <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
                    
                        {/* Tab 1: Editable Account Details */}
                        {activeTab === 'personal-info' && (
                            <div>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h4 className="fw-bold text-dark m-0">Personal Profile Information</h4>
                                    {!isEditing && (
                                        <button type="button" onClick={() => setIsEditing(true)} className="btn btn-outline-dark btn-sm px-4 rounded-pill">
                                            ✏️ Edit Information
                                        </button>
                                    )}
                                </div>
                        
                                <form onSubmit={handleProfileSubmit}>
                                    <div className="row g-4">
                                        <div className="col-md-6">
                                            <label className="form-label text-secondary fw-semibold">First Name</label>
                                            <input type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} disabled={!isEditing} className="form-control form-control-lg border-2 rounded-3" style={{ background: isEditing ? '#fff' : '#f8f9fa' }} required />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label text-secondary fw-semibold">Last Name</label>
                                            <input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} disabled={!isEditing} className="form-control form-control-lg border-2 rounded-3" style={{ background: isEditing ? '#fff' : '#f8f9fa' }} required />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label text-secondary fw-semibold">Primary Registered Email Address</label>
                                            <input type="email" value={profileData?.email || ''} disabled className="form-control form-control-lg bg-light text-muted border-2 rounded-3" />
                                            <small className="text-muted mt-1 d-block">Email addresses cannot be modified.</small>
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label text-secondary fw-semibold">Mobile Number</label>
                                            {/* FIX: Form controller input is unblocked and handles toggles correctly */}
                                            <input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} disabled={!isEditing} className="form-control form-control-lg border-2 rounded-3" style={{ background: isEditing ? '#fff' : '#f8f9fa' }} required />
                                            <small className="text-muted mt-1 d-block">Ensure phone digits map database compliance variables cleanly.</small>
                                        </div>
                                    </div>

                                    {isEditing && (
                                    <div className="d-flex justify-content-end gap-3 mt-5 border-top pt-4">
                                        <button type="button" onClick={() => { setIsEditing(false); fetchProfileDetails(); }} className="btn btn-light px-4 rounded-pill btn-lg">
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-warning px-5 rounded-pill btn-lg text-white fw-medium shadow-sm">
                                            Save Updates
                                        </button>
                                    </div>
                                    )}
                                </form>
                            </div>
                        )}

                        {/* Tab 2: Address Records Ledger Grid */}
                        {activeTab === 'saved-addresses' && (
                            <div>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h4 className="fw-bold text-dark m-0">Managed Delivery Hub Locations</h4>
                                </div>

                                <div className="row g-3">
                                    {profileData?.delivery_addresses && profileData.delivery_addresses.length > 0 ? (
                                        profileData.delivery_addresses.map((address) => (
                                            <div className="col-md-6" key={address.id}>
                                                <div className={`card h-100 border-2 rounded-4 p-4 position-relative ${address.is_default ? 'border-warning bg-warning bg-opacity-10' : 'border-light bg-light'}`}>
                                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                                        <span className={`badge px-3 py-2 rounded-pill ${address.address_tag === 'HOME' ? 'bg-danger' : address.address_tag === 'OFFICE' ? 'bg-primary' : 'bg-dark'}`}>
                                                            {address.address_tag}
                                                        </span>

                                                        {address.is_default && <span className="text-warning fw-bold fs-6">⭐️ Preferred</span>}
                                                    </div>
                                                    
                                                    <h6 className="fw-bold mb-1 text-dark">{address.contact_person_name}</h6>
                                                    <p className="small text-secondary mb-2"><i className="bi bi-telephone"></i> {address.contact_person_phone}</p>
                                                    <p className="small text-dark mb-0 fw-medium">
                                                        {address.street_address}, {address.area_or_neighborhood}, {address.city_or_division}
                                                    </p>

                                                    {address.delivery_landmark && (
                                                        <p className="small text-muted mt-2 mb-0 italic">
                                                            📍 <span className="fst-italic">{address.delivery_landmark}</span>
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-5 text-secondary w-100">
                                            <h3>📦</h3>
                                            <p className="mb-0 mt-2">No registered tracking address profiles discovered.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </PublicLayout>
  )
}

export default UserMyProfile;