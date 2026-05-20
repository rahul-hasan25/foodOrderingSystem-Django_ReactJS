import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AdminLayout from '../components/AdminLayout';
import '../styles/category.css'

const AddFood = () => {
    const [formData, setFormData] = useState({
        category: '',
        item_name: '',
        item_price: '',
        item_description: '',
        item_quantity: '',
        is_available: true
    });
    
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [categories, setCategories] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const CATEGORY_API_URL = "http://127.0.0.1:8000/api/categories-list/";
    const ADD_FOOD_API_URL = "http://127.0.0.1:8000/api/foods_add/";

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(CATEGORY_API_URL);
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
                toast.error("Failed to load categories. Please refresh!");
            }
        };
        fetchCategories();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.category || !formData.item_name || !formData.item_price || !imageFile || !formData.item_quantity) {
            toast.warn("Please fill in all required fields and upload an image.");
            return;
        }

        setIsSubmitting(true);

        const data = new FormData();
        data.append('category', formData.category);
        data.append('item_name', formData.item_name);
        data.append('item_price', formData.item_price);
        data.append('item_description', formData.item_description);
        data.append('image', imageFile);
        data.append('item_quantity', formData.item_quantity);
        data.append('is_available', formData.is_available);

        try {
            await axios.post(ADD_FOOD_API_URL, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success("Food Item Added Successfully!");

            setFormData({
                category: '',
                item_name: '',
                item_price: '',
                item_description: '',
                item_quantity: '',
                is_available: true
            });
            setImageFile(null);
            setImagePreview(null);
            e.target.reset();

        } catch (error) {
            console.error("Food Add Error:", error);
            if (error.response && error.response.data) {
                toast.error(`Error: ${JSON.stringify(error.response.data)}`);
            } else {
                toast.error("Server error. Could not add food item!");
            }
        } finally {
            setIsSubmitting(false);
        }
    };
  return (
    <AdminLayout>
        <div className="container-fluid min-vh-100 p-4 p-md-4" style={{ backgroundColor: '#fdfdfd', fontFamily: "'Poppins', sans-serif" }}>
            <div className="mb-3 pb-3 border-bottom border-light">
                <h3 className="fw-bold text-dark m-0" style={{ letterSpacing: '-0.5px', fontSize: '25px' }}>Add New Food Item</h3>
                <p className="text-muted small m-0 mt-1">Introduce a fresh and delicious dish to your digital restaurant menu</p>
            </div>

            <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden p-4 p-lg-3" style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}>                
                <form onSubmit={handleSubmit} className="row g-4">
                    <div className="col-12 col-lg-8 row g-4">
                        <div className="col-12 col-md-6">
                            <label className="form-label text-secondary fw-semibold small">Item Name <span className="text-danger">*</span></label>
                            <input type="text" name="item_name" value={formData.item_name} onChange={handleInputChange} className="form-control custom-placeholder" placeholder="e.g. Spicy Grilled Chicken" style={{ height: '46px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '14.5px' }} />
                        </div>

                        <div className="col-12 col-md-6">
                            <label className="form-label text-secondary fw-semibold small">Category <span className="text-danger">*</span></label>
                            <select name="category" value={formData.category} onChange={handleInputChange} className="form-select" style={{ height: '46px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '14.5px' }}>
                                <option value="">-- Select Category --</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.category_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-12 col-md-6">
                            <label className="form-label text-secondary fw-semibold small">Item Price (BDT) <span className="text-danger">*</span></label>
                            <div className="input-group">
                                <span className="input-group-text bg-light border-end-0 text-muted fw-medium" style={{ borderRadius: '8px 0 0 8px', border: '1.5px solid #e2e8f0' }}>BDT</span>
                                <input type="number" step="0.01" name="item_price" value={formData.item_price} onChange={handleInputChange} className="form-control border-start-0 custom-placeholder" placeholder="0.00" style={{ height: '46px', borderRadius: '0 8px 8px 0', border: '1.5px solid #e2e8f0', fontSize: '14.5px' }}/>
                            </div>
                        </div>

                        <div className="col-12 col-md-6">
                            <label className="form-label text-secondary fw-semibold small">Item Quantity <span className="text-danger">*</span></label>
                            <input type="text" name="item_quantity" value={formData.item_quantity} onChange={handleInputChange} className="form-control custom-placeholder" placeholder="e.g. 1 Plate, 1:2 Serving, 500ml" style={{ height: '46px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '14.5px' }}/>
                        </div>

                        <div className="col-12">
                            <label className="form-label text-secondary fw-semibold small">Item Description</label>
                            <textarea name="item_description" value={formData.item_description} onChange={handleInputChange} className="form-control custom-placeholder" rows="4" maxLength="500" placeholder="Write a mouth-watering description within 500 characters..." style={{ borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '14.5px', resize: 'none' }}></textarea>
                        </div>
                    </div>

                    <div className="col-12 col-lg-4 d-flex flex-column align-items-center justify-content-start border-start border-light ps-lg-5">
                        <label className="form-label text-secondary fw-semibold small w-100 text-start mb-3">Food Item Image <span className="text-danger">*</span></label>
                        <div className="w-100 rounded-4 d-flex flex-column align-items-center justify-content-center position-relative mb-3 bg-light border border-dashed text-center" style={{ height: '240px', border: '2px dashed #cbd5e1', overflow: 'hidden' }}>                            
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} alt="Preview" className="w-100 h-100 object-fit-cover" />
                                    <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }} className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 rounded-circle" style={{ width: '30px', height: '30px', padding: '0' }}>
                                        <i className="bi bi-x-lg"></i>
                                    </button>
                                </>
                            ) : (
                                <div className="p-3">
                                    <i className="bi bi-cloud-arrow-up display-5 text-muted mb-2"></i>
                                    <p className="text-dark small fw-medium m-0">Upload food cover image</p>
                                    <span className="text-muted" style={{ fontSize: '11px' }}>Supports JPG, PNG, WEBP</span>
                                </div>
                            )}
                        </div>

                        <input type="file" id="food-image-input" accept="image/*" onChange={handleImageChange} className="d-none"/>
                        <label htmlFor="food-image-input" className="btn btn-outline-secondary btn-sm rounded-3 px-4 w-100 py-2 fw-medium" style={{ fontSize: '13px' }}>
                            <i className="bi bi-image me-2"></i> {imagePreview ? "Change Image" : "Choose File"}
                        </label>

                        <div className="form-check form-switch w-100 mt-4 ps-5 py-2 rounded-3 bg-light border border-light-subtle">
                            <input className="form-check-input mt-1 shadow-none" type="checkbox" name="is_available" id="isAvailableSwitch" checked={formData.is_available} onChange={handleInputChange} style={{ cursor: 'pointer' }}/>
                            <label className="form-check-input-label text-dark fw-semibold small" htmlFor="isAvailableSwitch" style={{ cursor: 'pointer' }}>
                                Is This Item Available?
                            </label>
                            <span className="d-block text-muted" style={{ fontSize: '11px' }}>Turn off if the item is out of stock.</span>
                        </div>
                    </div>

                    <div className="col-12 mt-3 border-top border-light pt-3 d-flex justify-content-end gap-3">
                        <button type="button" className="btn btn-light px-4 py-2 fw-medium" style={{ borderRadius: '8px', fontSize: '14px', border: '1px solid #e2e8f0' }} disabled={isSubmitting}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-dark px-5 py-2 fw-semibold shadow-sm text-white" style={{ borderRadius: '8px', fontSize: '14px', backgroundColor: '#1e293b', border: 'none' }} disabled={isSubmitting}>
                            {isSubmitting ? (
                                <> <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Saving Item... </>
                            ) : (
                                <> <i className="bi bi-check2-circle me-2"></i> Save Food Item </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </AdminLayout>
  )
}

export default AddFood
