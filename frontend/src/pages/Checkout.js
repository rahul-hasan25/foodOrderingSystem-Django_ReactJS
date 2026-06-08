import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import PublicLayout from '../components/PublicLayout';
import '../styles/checkout.css'

const Checkout = () => {
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem('userId');
  
  // App Stepper Logic
  const [currentStep, setCurrentStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  
  // Data Aggregations
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  
  // Structured ledger metrics calculated dynamically
  const [cartSummary, setCartSummary] = useState({ 
    items        : [], 
    subtotal     : 0, 
    shippingTotal: 0, 
    grandTotal   : 0 
  });

  // Form Input Bindings
  const [addressForm, setAddressForm] = useState({
    contact_person_name: '', contact_person_phone: '', alternative_phone: '',
    street_address: '', area_or_neighborhood: '', city_or_division: '',
    postal_code: '', delivery_landmark: '', address_tag: 'HOME', is_default: false
  });

  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD'); 
  
  const [cardDetails, setCardDetails] = useState({ number: '', name: '', expiry: '', cvc: '' });
  const [bkashDetails, setBkashDetails] = useState({ walletNumber: '', pin: '', otpSent: false, otp: '' });

  const loadCheckoutContext = useCallback(async () => {
    if (!currentUserId) {
      toast.error("Please login to proceed with secure payment.");
      navigate('/user/login');
      return;
    }
    try {
      setLoading(true);
      const addressRes = await axios.get('http://127.0.0.1:8000/api/checkout/addresses/', {
        headers: { 'X-User-Id': currentUserId }
      });
      setSavedAddresses(addressRes.data);
      
      const defaultAddr = addressRes.data.find(a => a.is_default);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
      } else if (addressRes.data.length > 0) {
        setSelectedAddressId(addressRes.data[0].id);
      } else {
        setShowNewAddressForm(true);
      }

      const cartRes = await axios.get('http://127.0.0.1:8000/api/cart/', {
        headers: { 'X-User-Id': currentUserId }
      });

      // Flexible extraction logic based on backend response shape
      let rawItemsArray = [];
      if (Array.isArray(cartRes.data)) {
        rawItemsArray = cartRes.data;
      } else if (cartRes.data && Array.isArray(cartRes.data.items)) {
        rawItemsArray = cartRes.data.items;
      } else if (cartRes.data && typeof cartRes.data === 'object') {
        rawItemsArray = cartRes.data.cart_items || cartRes.data.order_items || [];
      }

      let subtotalSum = 0;
      let shippingSum = 0;

      // Map through individual rows to build full item descriptions
      const resolvedItems = rawItemsArray.map(item => {
        const foodRef = item.food ? item.food : item; // Fallback safely to look at item roots if nested food is absent        
        const name = foodRef.item_name || "Delicious Food Item";
        const rawPrice = foodRef.discount_price || foodRef.item_price || 0;
        const price = Number(rawPrice) || 0;
        const quantity = Number(item.quantity) || 1;
        
        const itemShipping = foodRef.shipping_charge !== undefined ? Number(foodRef.shipping_charge) : 40.00;  // Dynamically match your Food models default=40.00 parameter

        subtotalSum += price * quantity;
        shippingSum += itemShipping * quantity;

        return {
          ...item,
          _resolvedName: name,
          _resolvedPrice: price,
          _resolvedShipping: itemShipping,
          quantity: quantity
        };
      });

      setCartSummary({
        items: resolvedItems,
        subtotal: subtotalSum,
        shippingTotal: shippingSum,
        grandTotal: subtotalSum + shippingSum
      });

    } catch (err) {
      console.error("Context Configuration Logs:", err);
      toast.error("Error configuring checkout workspace parameters.");
    } finally {
      setLoading(false);
    }
  }, [currentUserId, navigate]);

  useEffect(() => {
    loadCheckoutContext();
  }, [loadCheckoutContext]);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleAddNewAddress = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/checkout/addresses/', addressForm, {
        headers: { 'X-User-Id': currentUserId }
      });
      toast.success("Delivery destination added successfully!");
      setSavedAddresses(prev => [...prev, response.data]);
      setSelectedAddressId(response.data.id);
      setShowNewAddressForm(false);
    } catch (err) {
      toast.error("Error validating entry parameters.");
    }
  };

  const handleProceedToPayment = () => {
    if (!selectedAddressId && !showNewAddressForm) {
      toast.warn("Please select or create a delivery address mapping.");
      return;
    }
    if (showNewAddressForm) {
      toast.warn("Please save your current address form first.");
      return;
    }
    setCurrentStep(2);
  };

  const handleCompleteOrderProcessing = async () => {
    if (!cartSummary.items || cartSummary.items.length === 0) {
      toast.error("Your checkout cart summary is completely empty.");
      return;
    }

    if (!selectedAddressId) {
      toast.error("Please select a delivery address destination before checking out.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        address_id: selectedAddressId,
        payment_method: paymentMethod.toLowerCase(), // matches 'cod', 'card', 'bkash' choices on your Payment model
        grand_total: parseFloat(cartSummary.grandTotal) || 0.00, 
        shipping_charge: parseFloat(cartSummary.shippingTotal) || 0.00
      };

      const response = await axios.post('http://127.0.0.1:8000/api/checkout/place-order/', payload, {
        headers: { 'X-User-Id': currentUserId }
      });

      if (response.data.success) {
        toast.success(response.data.message ||`Success! Order placed. Trans ID: ${response.data.payment_details?.transaction_id || 'N/A'}`);
        window.dispatchEvent(new Event('cartUpdated')); 
        navigate('/my-orders');
      }
    } catch (err) {
      console.error("Submission Failure Logs:", err);
      toast.error(err.response?.data?.error || "Checkout process pipeline payment processing error.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && cartSummary.items.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100" style={{ fontFamily: "'Poppins', sans-serif" }}>
        <div className="spinner-border text-warning" role="status"><span className="visually-hidden">Loading...</span></div>
      </div>
    );
  }

  return (
    <PublicLayout>
      <div className="py-5" style={{ backgroundColor: '#f8fafc', fontFamily: "'Poppins', sans-serif", minHeight: '90vh' }}>
        <div className="container">
          
          {/* Step Pipeline Header */}
          <div className="row justify-content-center mb-5">
            <div className="col-md-8 text-center">
              <h2 className="fw-extrabold text-dark tracking-tight mb-4" style={{ fontWeight: 800 }}>
                Secure Checkout <span style={{ color: '#f97316' }}>Gateway</span>
              </h2>
              <div className="d-flex align-items-center justify-content-center gap-4 position-relative">
                <div className={`d-flex align-items-center gap-2 pb-2 px-3 ${currentStep === 1 ? 'border-bottom border-3 border-warning fw-bold text-dark' : 'text-secondary'}`}>
                  <span className="badge rounded-circle bg-warning text-white p-2 d-inline-flex align-items-center justify-content-center" style={{ width: 24, height: 24 }}>1</span> Delivery Profile
                </div>
                <i className="bi bi-arrow-right text-muted fs-5"></i>
                <div className={`d-flex align-items-center gap-2 pb-2 px-3 ${currentStep === 2 ? 'border-bottom border-3 border-warning fw-bold text-dark' : 'text-secondary'}`}>
                  <span className="badge rounded-circle bg-secondary text-white p-2 d-inline-flex align-items-center justify-content-center" style={{ width: 24, height: 24 }}>2</span> Payment Parameters
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {/* Left Side Workspace Form Modules */}
            <div className="col-12 col-lg-8">
              {currentStep === 1 ? (
                <div className="card border-0 rounded-4 shadow-sm p-4 bg-white">
                  <h4 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
                    <i className="bi bi-geo-alt text-warning"></i> Where should we drop your food?
                  </h4>

                  {/* Address Selection Area */}
                  {savedAddresses.length > 0 && (
                    <div className="row g-3 mb-4">
                      {savedAddresses.map((addr) => (
                        <div className="col-md-6" key={addr.id}>
                          <div onClick={() => { setSelectedAddressId(addr.id); setShowNewAddressForm(false); }} className={`card p-3 rounded-3 h-100 border-2 ${selectedAddressId === addr.id && !showNewAddressForm ? 'border-warning bg-warning bg-opacity-10' : 'border-light'}`} style={{ cursor: 'pointer', transition: 'all 0.2s' }}>
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <span className="badge bg-dark rounded-pill px-2 py-1 text-uppercase" style={{ fontSize: 10 }}>{addr.address_tag}</span>
                              {addr.is_default && <span className="text-warning small fw-bold"><i className="bi bi-star-fill"></i> Default</span>}
                            </div>
                            <h6 className="fw-bold text-dark mb-1">{addr.contact_person_name}</h6>
                            <p className="small text-secondary mb-2"><i className="bi bi-telephone"></i> {addr.contact_person_phone}</p>
                            <p className="small text-dark text-truncate mb-0">{addr.street_address}, {addr.area_or_neighborhood}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <button onClick={() => setShowNewAddressForm(!showNewAddressForm)} className="btn btn-outline-secondary btn-sm rounded-3 d-flex align-items-center gap-2 w-fit mb-4 px-3 py-2 fw-medium">
                    <i className={`bi ${showNewAddressForm ? 'bi-dash-lg' : 'bi-plus-lg'}`}></i>
                    {showNewAddressForm ? "Use Saved Delivery Location Profile" : "Ship to a Brand New Destination Address"}
                  </button>

                  {showNewAddressForm && (
                    <form onSubmit={handleAddNewAddress} className="row g-3 border-top pt-4">
                      <div className="col-md-6">
                        <label className="form-label text-secondary small fw-semibold">Recipient Full Name</label>
                        <input type="text" name="contact_person_name" value={addressForm.contact_person_name} onChange={handleFormChange} required className="form-control rounded-3 p-2.5" placeholder="John Doe" />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label text-secondary small fw-semibold">Primary Contact Phone</label>
                        <input type="tel" name="contact_person_phone" value={addressForm.contact_person_phone} onChange={handleFormChange} required className="form-control rounded-3 p-2.5" placeholder="+8801XXXXXXXXX" />
                      </div>

                      <div className="col-md-10">
                        <label className="form-label text-secondary small fw-semibold">Street Address / Floor / Apartment ID</label>
                        <input type="text" name="street_address" value={addressForm.street_address} onChange={handleFormChange} required className="form-control rounded-3 p-2.5" placeholder="Flat 4B, House 22, Road 11" />
                      </div>

                      <div className="col-md-2">
                        <label className="form-label text-secondary small fw-semibold">Postal Code</label>
                        <input type="text" name="postal_code" value={addressForm.postal_code} onChange={handleFormChange} className="form-control rounded-3 p-2.5" placeholder="1212" />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label text-secondary small fw-semibold">Neighborhood / Area Segment</label>
                        <input type="text" name="area_or_neighborhood" value={addressForm.area_or_neighborhood} onChange={handleFormChange} required className="form-control rounded-3 p-2.5" placeholder="Banani / Dhanmondi" />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label text-secondary small fw-semibold">City / Division State</label>
                        <input type="text" name="city_or_division" value={addressForm.city_or_division} onChange={handleFormChange} required className="form-control rounded-3 p-2.5" placeholder="Dhaka" />
                      </div>

                      <div className="col-12">
                        <label className="form-label text-secondary small fw-semibold">Nearby Landmark Descriptions</label>
                        <textarea name="delivery_landmark" value={addressForm.delivery_landmark} onChange={handleFormChange} rows="2" className="form-control rounded-3 p-2.5" placeholder="Opposite to standard public school entrance gates..."></textarea>
                      </div>

                      <div className="col-md-6 d-flex align-items-center">
                        <select name="address_tag" value={addressForm.address_tag} onChange={handleFormChange} className="form-select rounded-3 p-2.5 fw-semibold text-secondary">
                          <option value="HOME">🏠 Home Setting</option>
                          <option value="OFFICE">💼 Office Domain</option>
                          <option value="OTHER">✨ Alternate Spaces</option>
                        </select>
                      </div>

                      <div className="col-md-6 d-flex align-items-center">
                        <div className="form-check">
                          <input type="checkbox" id="is_default" name="is_default" checked={addressForm.is_default} onChange={handleFormChange} className="form-check-input" />
                          <label htmlFor="is_default" className="form-check-label text-secondary small fw-medium">Set as primary default destination profile</label>
                        </div>
                      </div>

                      <div className="col-12">
                        <button type="submit" className="btn btn-warning px-4 py-2.5 rounded-3 text-white fw-bold shadow-sm" style={{ background: '#f97316', border: 'none' }}>Save Destination Matrix</button>
                      </div>
                    </form>
                  )}

                  <div className="d-flex justify-content-end mt-5 border-top pt-4">
                    <button onClick={handleProceedToPayment} className="btn btn-warning px-5 py-3 rounded-3 text-white fw-bold d-flex align-items-center gap-2 shadow-md" style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', border: 'none' }}>
                      Proceed to Payments Engine <i className="bi bi-arrow-right-circle-fill"></i>
                    </button>
                  </div>
                </div>
              ) : (
                /* Step 2: Payment Pipeline */
                <div className="card border-0 rounded-4 shadow-sm p-4 bg-white">
                  <h4 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                    <i className="bi bi-shield-lock-fill text-success"></i> Secure Transaction Portal
                  </h4>
                  <p className="text-secondary small mb-4">Select your preferred payment method from our secure options.</p>

                  <div className="row g-3 mb-4">
                    <div className="col-md-4">
                      <div onClick={() => setPaymentMethod('COD')} className={`card p-4 rounded-4 text-center border-2 h-100 ${paymentMethod === 'COD' ? 'border-warning bg-warning bg-opacity-10 text-dark' : 'border-light text-secondary'}`} style={{ cursor: 'pointer', transition: 'all 0.2s' }}>
                        <i className="bi bi-wallet2 fs-1 text-warning mb-2"></i>
                        <h6 className="fw-bold m-0">Cash On Delivery</h6>
                        <small className="text-muted d-block mt-1">Pay at your doorstep</small>
                      </div>
                    </div>

                    <div className="col-md-4 disabled">
                      <div onClick={() => setPaymentMethod('CARD')} className={`card p-4 rounded-4 text-center border-2 h-100 ${paymentMethod === 'CARD' ? 'border-primary bg-primary bg-opacity-10 text-dark' : 'border-light text-secondary'}`} style={{ cursor: 'pointer', transition: 'all 0.2s' }}>
                        <i className="bi bi-credit-card-2-back fs-1 text-primary mb-2"></i>
                        <h6 className="fw-bold m-0">Credit / Debit Card</h6>
                        <small className="text-muted d-block mt-1">Visa, Mastercard, Amex</small>
                      </div>
                    </div>

                    <div className="col-md-4 disabled">
                      <div onClick={() => setPaymentMethod('BKASH')} className={`card p-4 rounded-4 text-center border-2 h-100 ${paymentMethod === 'BKASH' ? 'border-danger bg-danger bg-opacity-10 text-dark' : 'border-light text-secondary'}`} style={{ cursor: 'pointer', transition: 'all 0.2s' }}>
                        <div className="fw-bold text-danger mb-2" style={{ fontSize: '2rem', fontFamily: "'Ubuntu', sans-serif" }}>bKash</div>
                        <h6 className="fw-bold m-0">bKash MFS Wallet</h6>
                        <small className="text-muted d-block mt-1">Instant digital payment</small>
                      </div>
                    </div>
                  </div>

                  <div className="bg-light p-4 rounded-4 mb-4" style={{ minHeight: '200px' }}>
                    {paymentMethod === 'COD' && (
                      <div className="text-center py-3">
                        <i className="bi bi-truck text-success display-4 mb-2"></i>
                        <h5 className="fw-bold text-dark">No prepayment needed!</h5>
                        <p className="text-secondary small mx-auto mb-0" style={{ maxWidth: 400 }}>
                          Simply hand over the exact change to our delivery hero when your food arrives.
                        </p>
                      </div>
                    )}

                    {paymentMethod === 'CARD' && (
                      <div className="row g-3">
                        <div className="col-12">
                          <label className="form-label text-secondary small fw-bold">Card Number</label>
                          <div className="input-group">
                            <span className="input-group-text bg-white border-end-0"><i className="bi bi-credit-card-fill text-muted"></i></span>
                            <input type="text" className="form-control bg-white border-start-0 p-2.5 rounded-end-3" placeholder="4242 •••• •••• 4242" value={cardDetails.number} onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})} />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label text-secondary small fw-bold">Expiry Date</label>
                          <input type="text" className="form-control p-2.5 rounded-3" placeholder="MM/YY" value={cardDetails.expiry} onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})} />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label text-secondary small fw-bold">CVC / CVV</label>
                          <input type="password" maxLength="4" className="form-control p-2.5 rounded-3" placeholder="•••" value={cardDetails.cvc} onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value})} />
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'BKASH' && (
                      <div className="p-3 text-white rounded-4" style={{ backgroundColor: '#e2136e' }}>
                        <div className="d-flex align-items-center gap-3 mb-3">
                          <div className="bg-white px-3 py-1 rounded-3 fw-bold text-danger" style={{ fontSize: '1.4rem' }}>bKash</div>
                          <h6 className="fw-medium m-0 text-white">Merchant Checkout API Wallet</h6>
                        </div>

                        <div className="row g-3">
                          <div className="col-12">
                            <label className="form-label text-white small fw-bold">Your bKash Wallet Number</label>
                            <input type="tel" className="form-control border-0 p-2.5 rounded-3 text-dark font-monospace" placeholder="017XXXXXXXX" value={bkashDetails.walletNumber} onChange={(e) => setBkashDetails({...bkashDetails, walletNumber: e.target.value})} />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label text-white small fw-bold">Secure Account PIN</label>
                            <input type="password" maxLength="5" className="form-control border-0 p-2.5 rounded-3 text-dark" placeholder="•••••" value={bkashDetails.pin} onChange={(e) => setBkashDetails({...bkashDetails, pin: e.target.value})} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="d-flex justify-content-between mt-5 border-top pt-4">
                    <button onClick={() => setCurrentStep(1)} className="btn btn-outline-secondary px-4 py-2.5 rounded-3 fw-bold">
                      <i className="bi bi-chevron-left"></i> Go Back
                    </button>
                    <button onClick={handleCompleteOrderProcessing} className="btn btn-success px-5 py-2.5 rounded-3 text-white fw-bold d-flex align-items-center gap-2 shadow-md" style={{ backgroundColor: '#10b981', border: 'none' }}>
                      <i className="bi bi-shield-lock"></i> Authorize & Place Order (${cartSummary.grandTotal.toFixed(2)})
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar Summary Ledger Layout */}
            <div className="col-12 col-lg-4">
              <div className="card border-0 rounded-4 shadow-sm p-4 bg-white sticky-top" style={{ top: '100px', zIndex: 10 }}>
                <h5 className="fw-bold text-dark mb-4 pb-2 border-bottom">Order Summary</h5>
                
                <div className="overflow-auto mb-4" style={{ maxHeight: '340px' }}>
                  {cartSummary.items && cartSummary.items.map((item, idx) => (
                    <div className="d-flex align-items-center gap-3 mb-3 pb-2 border-bottom border-light" key={item.id || idx}>
                      <div className="bg-warning bg-opacity-10 rounded-3 d-flex align-items-center justify-content-center fw-bold text-warning" style={{ width: 45, height: 45, flexShrink: 0 }}>
                        {item.quantity}x
                      </div>

                        <div className="flex-grow-1 min-width-0">
                            <h6 className="text-sm fw-bold text-dark text-truncate mb-0">
                            {item._resolvedName}
                            </h6>

                            <small className="text-secondary font-monospace">
                            ${item._resolvedPrice.toFixed(2)} each
                            </small>
                        </div>

                      <div className="fw-bold text-dark font-monospace">
                        ${(item._resolvedPrice * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing Metrics Ledger */}
                <div className="d-flex flex-column gap-2 mb-4">
                  <div className="d-flex justify-content-between text-secondary small">
                    <span>Subtotal</span>
                    <span className="font-monospace">${cartSummary.subtotal.toFixed(2)}</span>
                  </div>

                  <div className="d-flex justify-content-between text-secondary small">
                    <span>Shipping Charges</span>
                    <span className="font-monospace text-dark fw-bold">${cartSummary.shippingTotal.toFixed(2)}</span>
                  </div>

                  <hr className="my-2" />

                  <div className="d-flex justify-content-between text-dark fw-bold fs-5">
                    <span>Grand Total</span>
                    <span className="font-monospace text-warning">${cartSummary.grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-light p-3 rounded-3 d-flex align-items-center gap-2 text-secondary small">
                  <i className="bi bi-shield-check text-success fs-4"></i>
                  <span>Your food choices are backed by secure encryption.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Checkout;