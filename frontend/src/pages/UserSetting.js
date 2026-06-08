import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import PublicLayout from './../components/PublicLayout';
import '../styles/setting.css';

const UserSetting = () => {
  const userId = localStorage.getItem('userId');

  // Section Tracking Matrices
  const [currentSection, setCurrentSection] = useState('profile');
  const [userData, setUserData] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Account Deletion Prompt Safeguards
  const [deleteConfirmationPassword, setDeleteConfirmationPassword] = useState('');
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  // Core System Preference States
  const [preferences, setPreferences] = useState({
    pushNotifications: true,
    emailMarketing: false,
    smsAlerts: true,
    darkMode: false,
    orderTrackingLive: true,
  });

  // State Input Elements
  const [profileForm, setProfileForm] = useState({ first_name: '', last_name: '', mobile: '' });
  const [securityForm, setSecurityForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [addressForm, setAddressForm] = useState({
    contact_person_name: '',
    contact_person_phone: '',
    street_address: '',
    area_or_neighborhood: '',
    city_or_division: '',
    postal_code: '',
    address_tag: 'HOME',
    is_default: false
  });

  useEffect(() => {
    fetchCoreSettings();
    fetchAddressBook();
  }, []);

  useEffect(() => {
    if (preferences.darkMode) {
      document.body.classList.add('dark-mode-active');
      document.body.style.backgroundColor = '#0f172a';
    } else {
      document.body.classList.remove('dark-mode-active');
      document.body.style.backgroundColor = '#f8fafc';
    }
  }, [preferences.darkMode]);

  const fetchCoreSettings = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/settings/profile/', {
        headers: { 'X-User-Id': userId }
      });
      if (res.ok) {
        const data = await res.json();
        setUserData(data);
        setProfileForm({ first_name: data.first_name, last_name: data.last_name, mobile: data.mobile });
      }
    } catch {
      toast.error('Could not sync user profile metrics.');
    }
  };

  const fetchAddressBook = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/settings/addresses/', {
        headers: { 'X-User-Id': userId }
      });
      if (res.ok) setAddresses(await res.json());
    } catch {
      toast.error('Failed to retrieve shipping directory.');
    }
  };

  const handlePreferenceToggle = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success(`System parameter modified.`, { autoClose: 1200 });
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/settings/profile/', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-User-Id': userId },
        body: JSON.stringify(profileForm)
      });
      if (res.ok) {
        toast.success('🎉 Account configurations updated.');
        fetchCoreSettings();
      }
    } catch {
      toast.error('Write operation aborted.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSecuritySave = async (e) => {
    e.preventDefault();
    if (securityForm.new_password !== securityForm.confirm_password) {
      toast.warning('Token allocations do not match.');
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/settings/security/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-User-Id': userId },
        body: JSON.stringify({
          current_password: securityForm.current_password,
          new_password: securityForm.new_password
        })
      });
      if (res.ok) {
        toast.success('🔒 Security key updated successfully.');
        setSecurityForm({ current_password: '', new_password: '', confirm_password: '' });
      } else {
        toast.error('Verification failure.');
      }
    } catch {
      toast.error('Error shifting authorization keys.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePermanentAccountPurge = async (e) => {
    e.preventDefault();
    if (!deleteConfirmationPassword) return;

    try {
      const res = await fetch('http://127.0.0.1:8000/api/settings/profile/purge/', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'X-User-Id': userId },
        body: JSON.stringify({ password_confirmation: deleteConfirmationPassword })
      });

      if (res.ok) {
        toast.error('💥 Profile removed permanently. Terminating session.');
        setIsDeleteModalVisible(false);
        setTimeout(() => {
          localStorage.clear();
          window.location.href = '/login';
        }, 2000);
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'Authentication error.');
      }
    } catch {
      toast.error('Failed to complete permanent server database deletion.');
    }
  };

  const navItems = [
    { id: 'profile', label: 'My Profile', icon: 'bi-person-vcard' },
    { id: 'security', label: 'Security & Keys', icon: 'bi-shield-lock-fill' },
    { id: 'addresses', label: 'Saved Destinations', icon: 'bi-geo-alt-fill' },
    { id: 'notifications', label: 'System Notifications', icon: 'bi-bell-fill' },
    { id: 'preferences', label: 'Interface Configurations', icon: 'bi-sliders' },
    { id: 'dangerZone', label: 'Account Controls', icon: 'bi-exclamation-triangle-fill' }
  ];
  return (
    <PublicLayout>
      <div className={`container py-5 fex-settings-viewport ${preferences.darkMode ? 'text-light' : 'text-dark'}`}>
      <ToastContainer position="top-right" autoClose={2500} theme={preferences.darkMode ? 'dark' : 'light'} />

      {/* Modern Dashboard Header */}
      <div className="card border-0 rounded-4 shadow-sm p-4 mb-4 glass-panel">
        <div className="row align-items-center g-3">
          <div className="col-md-7 d-flex align-items-center gap-3">
            <button className="btn btn-warning text-white d-md-none rounded-3 px-3 py-2" onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}>
              <i className="bi bi-list fs-5"></i>
            </button>
            <div>
              <h4 className="fw-bold m-0 tracking-tight">User Operations Center</h4>
              <p className="text-muted small m-0">Review system bindings and local preferences</p>
            </div>
          </div>
          <div className="col-md-5">
            <div className="d-flex justify-content-between mb-1 small fw-medium text-muted">
              <span>Profile Setup Metrics</span>
              <span>{userData?.profile_completion_percentage || 0}%</span>
            </div>
            <div className="progress rounded-3" style={{ height: '8px', backgroundColor: 'rgba(0,0,0,0.06)' }}>
              <div 
                className="progress-bar rounded-3" 
                style={{ 
                  width: `${userData?.profile_completion_percentage || 0}%`, 
                  background: 'linear-gradient(90deg, #ff6b6b, #ffb84d)' 
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Main Side Management Panels Navigation Menu */}
        <div className={`col-md-4 col-lg-3 custom-sidebar-drawer ${mobileSidebarOpen ? 'show' : ''}`}>
          <div className="card border-0 shadow-sm rounded-4 p-3 glass-panel h-100">
            <div className="list-group list-group-flush border-0">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => { setCurrentSection(item.id); setMobileSidebarOpen(false); }}
                  className={`list-group-item list-group-item-action d-flex align-items-center gap-3 py-3 border-0 rounded-3 mb-1 fex-nav-pill ${
                    currentSection === item.id 
                      ? 'bg-warning bg-opacity-15 text-warning fw-bold border-start border-3 border-warning' 
                      : item.id === 'dangerZone' ? 'text-danger' : 'text-secondary bg-transparent'
                  }`}
                >
                  <i className={`bi ${item.icon} fs-5`}></i>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Workspace Operations Screen Panel View */}
        <div className="col-md-8 col-lg-9">
          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 glass-panel h-100">
            
            {/* Dynamic UI View Grid Route 1: Profile Modifications */}
            {currentSection === 'profile' && (
              <div>
                <h5 className="fw-bold mb-4 border-bottom pb-2">Profile Specifications</h5>
                <form onSubmit={handleProfileSave}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-bold">First Name</label>
                      <input type="text" className="form-control fex-custom-input rounded-3" value={profileForm.first_name} onChange={e => setProfileForm({...profileForm, first_name: e.target.value})} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-bold">Last Name</label>
                      <input type="text" className="form-control fex-custom-input rounded-3" value={profileForm.last_name} onChange={e => setProfileForm({...profileForm, last_name: e.target.value})} required />
                    </div>
                    <div className="col-12">
                      <label className="form-label text-muted small fw-bold">Registered Core Email Address</label>
                      <input type="email" className="form-control fex-custom-input bg-light opacity-75 text-muted rounded-3" value={userData?.email || ''} disabled />
                    </div>
                    <div className="col-12">
                      <label className="form-label text-muted small fw-bold">Mobile Communications Number</label>
                      <input type="tel" className="form-control fex-custom-input rounded-3" value={profileForm.mobile} onChange={e => setProfileForm({...profileForm, mobile: e.target.value})} required />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-warning text-white rounded-3 px-4 py-2 mt-4 fw-medium shadow-sm" disabled={isSaving}>
                    {isSaving ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-check-circle-fill me-2"></i>}
                    Save Profile Changes
                  </button>
                </form>
              </div>
            )}

            {/* Dynamic UI View Grid Route 2: Security & Passwords */}
            {currentSection === 'security' && (
              <div>
                <h5 className="fw-bold mb-4 border-bottom pb-2">Authentication & Keys</h5>
                <form onSubmit={handleSecuritySave}>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label text-muted small fw-bold">Current Verification Password</label>
                      <input type="password" className="form-control fex-custom-input rounded-3" value={securityForm.current_password} onChange={e => setSecurityForm({...securityForm, current_password: e.target.value})} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-bold">New Security Password</label>
                      <input type="password" className="form-control fex-custom-input rounded-3" value={securityForm.new_password} onChange={e => setSecurityForm({...securityForm, new_password: e.target.value})} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-bold">Confirm New Security Password</label>
                      <input type="password" className="form-control fex-custom-input rounded-3" value={securityForm.confirm_password} onChange={e => setSecurityForm({...securityForm, confirm_password: e.target.value})} required />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-dark text-white rounded-3 px-4 py-2 mt-4 fw-medium" disabled={isSaving}>
                    <i className="bi bi-key-fill me-2"></i>Update Password Credentials
                  </button>
                </form>
              </div>
            )}

            {/* Dynamic UI View Grid Route 3: Address Books */}
            {currentSection === 'addresses' && (
              <div>
                <h5 className="fw-bold mb-4 border-bottom pb-2">Delivery Destinations Directory</h5>
                <div className="row g-3">
                  {addresses.map(addr => (
                    <div className="col-md-6" key={addr.id}>
                      <div className={`card h-100 border rounded-3 p-3 ${addr.is_default ? 'border-warning bg-warning bg-opacity-10' : 'bg-transparent'}`}>
                        <div className="d-flex justify-content-between mb-2">
                          <span className="badge bg-secondary rounded-pill small">{addr.address_tag}</span>
                          {addr.is_default && <span className="text-warning small fw-bold">Default Destination</span>}
                        </div>
                        <h6 className="fw-bold mb-1 small">{addr.contact_person_name}</h6>
                        <p className="text-muted mb-0 small">{addr.street_address}, {addr.area_or_neighborhood}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dynamic UI View Grid Route 4: Notifications Channels */}
            {currentSection === 'notifications' && (
              <div>
                <h5 className="fw-bold mb-4 border-bottom pb-2">Alert Management Routes</h5>
                <div className="d-flex justify-content-between align-items-center py-3 border-bottom border-light">
                  <div>
                    <h6 className="fw-semibold mb-1 small">Realtime Push Notifications</h6>
                    <p className="text-muted small mb-0">Delivers transactional dispatches directly onto device screen areas</p>
                  </div>
                  <div className="form-check form-switch fs-5">
                    <input className="form-check-input" type="checkbox" checked={preferences.pushNotifications} onChange={() => handlePreferenceToggle('pushNotifications')} />
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center py-3">
                  <div>
                    <h6 className="fw-semibold mb-1 small">SMS Delivery Notifications</h6>
                    <p className="text-muted small mb-0">Sends active courier updates to your mobile phone number during delivery route handoffs</p>
                  </div>
                  <div className="form-check form-switch fs-5">
                    <input className="form-check-input" type="checkbox" checked={preferences.smsAlerts} onChange={() => handlePreferenceToggle('smsAlerts')} />
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic UI View Grid Route 5: Themes Configurations */}
            {currentSection === 'preferences' && (
              <div>
                <h5 className="fw-bold mb-4 border-bottom pb-2">Interface Customization Options</h5>
                <div className="d-flex justify-content-between align-items-center py-3">
                  <div>
                    <h6 className="fw-semibold mb-1 small">Aesthetic Dark Interface Theme</h6>
                    <p className="text-muted small mb-0">Switches the interface canvas layer color palette to dark mode colors</p>
                  </div>
                  <div className="form-check form-switch fs-5">
                    <input className="form-check-input" type="checkbox" checked={preferences.darkMode} onChange={() => handlePreferenceToggle('darkMode')} />
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic UI View Grid Route 6: Danger Zone / Permanent Profile Erasure View Component */}
            {currentSection === 'dangerZone' && (
              <div>
                <h5 className="fw-bold text-danger mb-4 border-bottom border-danger border-opacity-20 pb-2">Danger Operations Zone</h5>
                <div className="card border-danger border-opacity-30 rounded-3 p-4 bg-danger bg-opacity-10 text-danger">
                  <h6 className="fw-bold mb-2">Permanently Terminate Account Registry Profiles</h6>
                  <p className="small mb-3 opacity-90">
                    Executing this configuration command permanently deletes your database record profile entries, 
                    clears your active shipping address book histories, and removes related account records. This operation cannot be undone.
                  </p>
                  <button type="button" className="btn btn-danger rounded-3 fw-medium px-4 py-2" onClick={() => setIsDeleteModalVisible(true)}>
                    Terminate Profile Permanently
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Security Intent Confirmation Deletion Overlay Dialog Screen */}
      {isDeleteModalVisible && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', zIndex: 1100 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow p-3 text-dark bg-white">
              <div className="modal-header border-0 pb-0">
                <h6 className="modal-title fw-bold text-danger">Confirm Permanent Account Profile Deletion</h6>
                <button type="button" className="btn-close" onClick={() => setIsDeleteModalVisible(false)}></button>
              </div>
              <form onSubmit={handlePermanentAccountPurge}>
                <div className="modal-body py-3">
                  <p className="small text-muted mb-3">
                    Please provide your account verification password to confirm identity permission constraints before records erasure commands execute.
                  </p>
                  <input 
                    type="password" 
                    placeholder="Provide Active System Password" 
                    className="form-control fex-custom-input rounded-3 w-100"
                    value={deleteConfirmationPassword}
                    onChange={e => setDeleteConfirmationPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="modal-footer border-0 pt-0 d-flex gap-2 justify-content-end">
                  <button type="button" className="btn btn-light rounded-3 px-3" onClick={() => setIsDeleteModalVisible(false)}>Cancel Action</button>
                  <button type="submit" className="btn btn-danger rounded-3 px-4 fw-medium">Confirm Permanent Purge</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Navigation Screen Overlay Layer Canvas */}
      {mobileSidebarOpen && <div className="modal-backdrop fade show d-md-none" onClick={() => setMobileSidebarOpen(false)} style={{ zIndex: 1040 }}></div>}
    </div>
    </PublicLayout>
  )
}

export default UserSetting
