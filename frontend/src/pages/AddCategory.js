import React, { useState } from 'react';
import axios from 'axios';
import { toast } from "react-toastify"
import '../styles/category.css'
import AdminLayout from '../components/AdminLayout'

const AddCategory = () => {
    const [categoryName, setCategoryName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async(e) => {
        e.preventDefault();

        const trimmedCategory = categoryName.trim();
        if (!trimmedCategory) {
            toast.warn("Please enter a valid category name!");
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/add-category/', { name: trimmedCategory });
            await new Promise((resolve) => setTimeout(resolve, 1500));

            console.log("Category Added:", trimmedCategory);
            
            toast.success(`🎉 "${trimmedCategory}" added successfully!`);
            setCategoryName('');
        } catch (error) {
            console.error("Error adding category:", error);
            toast.error("Failed to add category!");
        } finally {
            setIsLoading(false);
        }
    };
  return (
    <AdminLayout>
        <div className="container-fluid min-vh-100 p-5" style={{ backgroundColor: '#f8fafc', fontFamily: "'Poppins', sans-serif" }}>
            <div className="mb-5">
                <h4 className="fw-bold text-dark m-0" style={{ letterSpacing: '0.5px' }}>Add Categories</h4>
                <p className="text-muted small m-0 mt-1">Add your restaurant food categories</p>
            </div>

            <div className="row g-4 align-items-center">
                <div className="col-12 col-lg-6">
                    <div className="card border-0 shadow-sm p-4 p-md-5" style={{ backgroundColor: '#ffffff' }}>
                        <div className="d-flex align-items-center gap-3 mb-4">
                            <div className="d-flex align-items-center justify-content-center rounded-2 text-white" style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg, #f97316, #fb923c)' }}>
                                <i className="bi bi-plus-circle-fill fs-5"></i>
                            </div>
                            
                            <div>
                                <h5 className="fw-bold m-0 text-dark" style={{ fontSize: '18px' }}>Add Category</h5>
                                <p className="text-muted m-0" style={{ fontSize: '12px' }}>Create a new food group</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="categoryName" className="form-label fw-semibold text-secondary small mb-2"> Category Name</label>
                                <div className="position-relative">
                                    <i className="bi bi-tags text-muted position-absolute top-50 translate-middle-y ms-3" style={{ fontSize: '16px' }}></i>
                                    <input type="text" className="form-control text-dark custom-placeholder" id="categoryName" placeholder="e.g. Fast Food, Desserts" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required style={{ paddingLeft: '45px', height: '50px', border: '1.5px solid #e2e8f0',fontSize: '14px', backgroundColor: '#f8fafc', transition: 'all 0.2s', color: '#000000'}} onFocus={(e) => {e.target.style.borderColor = '#f97316';e.target.style.backgroundColor = '#ffffff';e.target.style.boxShadow = '0 0 0 4px rgba(249, 115, 22, 0.1)';}} onBlur={(e) => {e.target.style.borderColor = '#e2e8f0';e.target.style.backgroundColor = '#f8fafc';e.target.style.boxShadow = 'none';}}/>
                                </div>
                            </div>

                            <button type="submit" className="btn w-100 d-flex align-items-center justify-content-center gap-2 fw-semibold text-white shadow-sm border-0" disabled={isLoading} style={{ height: '50px', borderRadius: '12px', background: 'linear-gradient(135deg, #f97316, #ea580c)', fontSize: '15px', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.95'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                                    {isLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            <span>Adding...</span>
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-plus-circle-fill"></i> Add Category
                                        </>
                                    )}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="col-12 col-lg-6 d-flex justify-content-center align-items-center ps-lg-5 mt-5 mt-lg-0">
                    <div className="text-center position-relative p-5" style={{ maxWidth: '450px' }}>
                        <div className="position-absolute top-50 left-50 translate-middle rounded-circle" style={{ width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)',zIndex: 0 }} />
                        <div className="position-relative" style={{ zIndex: 1 }}>
                            <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4" style={{ width: '120px', height: '120px', backgroundColor: 'rgba(249, 115, 22, 0.06)',border: '2px dashed rgba(249, 115, 22, 0.2)'}}>
                                <i className="bi bi-egg-fried" style={{ fontSize: '55px', color: '#f97316' }}></i>
                            </div>
                    
                            <h5 className="fw-bold text-dark mb-2" style={{ fontSize: '18px' }}>Organize Your Menu</h5>
                            <p className="text-muted small px-4" style={{ lineHeight: '1.6' }}>
                                Adding clear categories helps customers browse your food items effortlessly and boosts your restaurant sales.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
  )
}

export default AddCategory
