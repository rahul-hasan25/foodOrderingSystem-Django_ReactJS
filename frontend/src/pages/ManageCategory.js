import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AdminLayout from './../components/AdminLayout';

const ManageCategory = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const API_URL = "http://127.0.0.1:8000/api/categories/";

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(API_URL);
            setCategories(response.data); 
        } catch (error) {
            console.error("API Fetch Error:", error);
            toast.error("Failed to load categories from server!");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchQuery(searchInput);
    };

    const filteredCategories = categories.filter(category =>
        category.category_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleEdit = async (id, current_category_name) => {
        const newCategoryName = prompt(`Update Category Name for "${current_category_name}":`, current_category_name);
        if (!newCategoryName || newCategoryName.trim() === "" || newCategoryName.trim() === current_category_name) return;
        try {
            const response = await axios.put(`${API_URL}${id}/`, {
                category_name: newCategoryName.trim()
            });
            setCategories(categories.map(cat => 
                cat.id === id ? { ...cat, category_name: response.data.category_name } : cat
            ));
            toast.info(`Updated to "${response.data.category_name}"`);
        } catch (error) {
            console.error("DRF Update Error:", error);
            toast.error("Failed to update category. Please try again!");
        }
    };

    const handleDelete = async (id, category_name) => {
        if (window.confirm(`Are you sure you want to delete "${category_name}"?`)) {
            try {
                await axios.delete(`${API_URL}${id}/`);
                setCategories(categories.filter(category => category.id !== id));
                toast.error(`"${category_name}" deleted successfully!`);
            } catch (error) {
                console.error("Delete Error:", error);
                toast.warn("Could not delete. Server error!");
            }
        }
    };
  return (
    <AdminLayout>
        <div className="container-fluid min-vh-100 p-4 p-md-4" style={{ backgroundColor: '#fdfdfd', fontFamily: "'Poppins', sans-serif" }}>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-4 mb-3 pb-3 border-bottom border-light">
                <div>
                    <h3 className="fw-bold text-dark m-0" style={{ letterSpacing: '-0.5px', fontSize: '28px' }}>Manage Categories</h3>
                    <p className="text-muted small m-0 mt-1">Review, filter, and structure your digital restaurant menu categories</p>
                </div>

                <div className="card border-0 shadow-sm px-4 py-3 bg-white rounded-4 d-flex flex-row align-items-center gap-3" style={{ minWidth: '210px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                    <div className="rounded-3 d-flex align-items-center justify-content-center text-white" style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>
                        <i className="bi bi-grid-3x3-gap-fill fs-5"></i>
                    </div>

                    <div>
                        <p className="text-muted small m-0 fw-medium text-uppercase tracking-wider" style={{ fontSize: '10px' }}>Total Categories</p>
                        <h3 className="fw-bold text-dark m-0" style={{ fontSize: '22px' }}>{isLoading ? "..." : categories.length}</h3>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSearch} className="row g-3 mb-3 align-items-center justify-content-between">
                <div className="col-12 col-md-5 col-lg-4">
                    <div className="input-group shadow-sm rounded-3 overflow-hidden" style={{ border: '1px solid #e2e8f0' }}>
                        <span className="input-group-text bg-white border-0 ps-3">
                            <i className="bi bi-search text-muted"></i>
                        </span>
                        <input type="text" className="form-relative form-control bg-white text-dark border-0 py-2 custom-placeholder" placeholder="Type category name..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} disabled={isLoading} style={{ height: '46px', fontSize: '14px', boxShadow: 'none' }}/>
                        {searchInput && (
                            <button type="button" onClick={() => { setSearchInput(''); setSearchQuery(''); }} className="btn bg-white text-muted border-0 pe-3" style={{ fontSize: '14px' }}>
                                <i className="bi bi-x-circle-fill"></i>
                            </button>
                        )}
                    </div>
                </div>
                
                <div className="col-12 col-md-auto me-md-auto">
                    <button type="submit" className="btn btn-dark px-4 fw-semibold shadow-sm text-white" style={{ height: '46px', borderRadius: '8px', fontSize: '14px', backgroundColor: '#1e293b', border: 'none', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0f172a'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}>
                        <i className="bi bi-sliders me-2"></i> Search
                    </button>
                </div>

                <div className="col-12 col-md-auto text-muted small text-md-end">
                    Showing <span className="text-dark fw-semibold">{isLoading ? 0 : filteredCategories.length}</span> entries
                </div>
            </form>

            <div className="card border-0 shadow-sm overflow-hidden bg-white" style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.03)' }}>
                <div className="table-responsive">
                    <table className="table align-middle mb-0" style={{ minWidth: '800px' }}>
                        <thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #f1f5f9' }}>
                            <tr>
                                <th className="py-3 px-4 text-secondary fw-semibold text-center text-uppercase tracking-wider" style={{ width: '10%', fontSize: '12px' }}>SL No</th>
                                <th className="py-3 px-4 text-secondary fw-semibold text-uppercase tracking-wider" style={{ fontSize: '12px' }}>Category Name</th>
                                <th className="py-3 px-4 text-secondary fw-semibold text-uppercase tracking-wider" style={{ fontSize: '12px' }}>Creation Date</th>
                                <th className="py-3 px-4 text-secondary fw-semibold text-center text-uppercase tracking-wider" style={{ width: '15%', fontSize: '12px' }}>Action</th>
                            </tr>
                        </thead>
                        
                        <tbody className="border-0">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-5">
                                        <div className="spinner-border text-warning" role="status" style={{ width: '2.5rem', height: '2.5rem' }}>
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <p className="text-muted mt-2 small fw-medium">Fetching secure data from server...</p>
                                    </td>
                                </tr>
                            ) : filteredCategories.length > 0 ? (
                                filteredCategories.map((category, index) => (
                                    <tr key={category.id} className="border-bottom border-light" style={{ transition: 'all 0.2s' }}>
                                        <td className="py-3 px-4 text-center">
                                            <span className="badge rounded-2 bg-light text-secondary px-2 py-2 fw-semibold" style={{ fontSize: '12px', minWidth: '28px' }}>
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                        </td>
                                        
                                        <td className="py-3 px-4">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="rounded-circle" style={{ width: '6px', height: '6px', backgroundColor: '#f97316' }}></div>
                                                <span className="fw-semibold text-dark" style={{ fontSize: '15px', letterSpacing: '-0.2px' }}>
                                                    {category.category_name}
                                                </span>
                                            </div>
                                        </td>
                                        
                                        <td className="py-3 px-4 text-secondary" style={{ fontSize: '13.5px' }}>
                                            <div className="d-flex align-items-center gap-2">
                                                <i className="bi bi-clock-history text-muted"></i>
                                                {new Date(category.creation_date).toLocaleDateString()}
                                            </div>
                                        </td>
                                        
                                        <td className="py-3 px-4 text-center">
                                            <div className="d-flex justify-content-center gap-2">
                                                <button onClick={() => handleEdit(category.id, category.category_name)} className="btn rounded-3 border-0 text-dark d-inline-flex align-items-center justify-content-center shadow-sm" style={{ width: '36px', height: '36px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }} title="Edit Category">
                                                    <i className="bi bi-pencil fs-6"></i>
                                                </button>
                                                
                                                <button onClick={() => handleDelete(category.id, category.category_name)} className="btn rounded-3 border-0 text-danger d-inline-flex align-items-center justify-content-center shadow-sm" style={{ width: '36px', height: '36px', backgroundColor: '#fff5f5', border: '1px solid #fee2e2' }} title="Delete Category">
                                                    <i className="bi bi-trash3 fs-6"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-5" style={{ backgroundColor: '#fafafa' }}>
                                        <div className="py-4">
                                            <i className="bi bi-search display-5 text-muted mb-3 d-block"></i>
                                            <h5 className="fw-bold text-dark mb-1">No Categories Match Your Search</h5>
                                            <p className="text-muted small">Please verify the name or click the cross button to reset filter.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </AdminLayout>
  )
}

export default ManageCategory
