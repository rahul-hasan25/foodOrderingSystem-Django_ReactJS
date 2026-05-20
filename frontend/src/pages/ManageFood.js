import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AdminLayout from '../components/AdminLayout'
import '../styles/category.css'

const ManageFood = () => {
    const [foods, setFoods] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const API_URL = "http://127.0.0.1:8000/api/food_manage/";

    const fetchFoods = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(API_URL);
            setFoods(response.data);
        } catch (error) {
            console.error("Error fetching foods:", error);
            toast.error("Failed to load food items from server!");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFoods();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchQuery(searchInput);
    };

    const handleEdit = async (id, current_name, current_price) => {
        const newName = prompt(`Update Food Name for "${current_name}":`, current_name);
        if (newName === null) return;
        if (newName.trim() === "") {
            toast.warn("Food name cannot be empty!");
            return;
        }

        const newPrice = prompt(`Update Price for "${newName.trim()}":`, current_price);
        if (newPrice === null) return;
        if (isNaN(newPrice) || parseFloat(newPrice) <= 0) {
            toast.warn("Please enter a valid price amount!");
            return;
        }

        try {
            const response = await axios.put(`${API_URL}${id}/`, {
                item_name: newName.trim(),
                item_price: parseFloat(newPrice)
            });

            setFoods(foods.map(food => 
                food.id === id 
                    ? { ...food, item_name: response.data.item_name, item_price: response.data.item_price } 
                    : food
            ));

            toast.info(`"${response.data.item_name}" updated successfully!`);

        } catch (error) {
            console.error("Food Update Error:", error);
            toast.error("Failed to update food item. Try again!");
        }
    };

    const handleDelete = async (id, item_name) => {
        if (window.confirm(`Are you sure you want to delete "${item_name}"?`)) {
            try {
                await axios.delete(`${API_URL}${id}/`);
                setFoods(foods.filter(food => food.id !== id));
                toast.error(`"${item_name}" removed from menu!`);
            } catch (error) {
                console.error("Delete Error:", error);
                toast.error("Could not delete the item. Try again!");
            }
        }
    };

    const toggleAvailability = async (id, currentStatus, item_name) => {
        try {
            const response = await axios.put(`${API_URL}${id}/`, {
                is_available: !currentStatus
            });
            
            setFoods(foods.map(food => 
                food.id === id ? { ...food, is_available: response.data.is_available } : food
            ));

            toast.success(`"${item_name}" is now ${response.data.is_available ? 'Available' : 'Unavailable'}`);
        } catch (error) {
            console.error("Toggle Error:", error);
            toast.error("Failed to update status.");
        }
    };

    const filteredFoods = foods.filter(food =>
        food.item_name?.toLowerCase().includes(searchQuery.toLowerCase()) || food.category_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  return (
    <AdminLayout>
        <div className="container-fluid min-vh-100 p-4 p-md-3" style={{ backgroundColor: '#fdfdfd', fontFamily: "'Poppins', sans-serif" }}>
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-4 mb-2 pb-3 border-bottom border-light">
                    <div>
                        <h3 className="fw-bold text-dark m-0" style={{ letterSpacing: '-0.5px', fontSize: '24px' }}>Manage Food Items</h3>
                        <p className="text-muted small m-0 mt-1">Track prices, stock quantity, and availability status of your dishes</p>
                    </div>

                    <div className="card border-0 shadow-sm px-3 py-2 bg-white d-flex flex-row align-items-center gap-3" style={{ minWidth: '210px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                        <div className="rounded-2 d-flex align-items-center justify-content-center text-white" style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>
                            <i className="bi bi-egg-fried fs-5"></i>
                        </div>
                        <div>
                            <p className="text-muted small m-0 fw-medium text-uppercase tracking-wider" style={{ fontSize: '10px' }}>Total Dishes</p>
                            <h3 className="fw-bold text-dark m-0" style={{ fontSize: '22px' }}>{isLoading ? "..." : foods.length}</h3>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSearch} className="row g-2 mb-4 align-items-center justify-content-between">
                    <div className="col-12 col-md-5 col-lg-4">
                        <div className="input-group shadow-sm rounded-3 overflow-hidden" style={{ border: '1px solid #e2e8f0' }}>
                            <span className="input-group-text bg-white border-0 ps-3">
                                <i className="bi bi-search text-muted"></i>
                            </span>
                            <input type="text" className="form-control bg-white text-dark border-0 py-2 custom-placeholder" placeholder="Search by food or category..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} style={{ height: '35px', fontSize: '14px', boxShadow: 'none' }} disabled={isLoading}/>
                            {searchInput && (
                                <button type="button" onClick={() => { setSearchInput(''); setSearchQuery(''); }} className="btn bg-white text-muted border-0 pe-3">
                                    <i className="bi bi-x-circle-fill"></i>
                                </button>
                            )}
                        </div>
                    </div>
                    
                    <div className="col-12 col-md-auto me-md-auto">
                        <button type="submit" className="btn btn-dark px-4 fw-semibold shadow-sm text-white" style={{ height: '35px', borderRadius: '5px', fontSize: '14px', backgroundColor: '#1e293b', border: 'none' }} disabled={isLoading}>
                            <i className="bi bi-sliders me-2"></i> Search
                        </button>
                    </div>

                    <div className="col-12 col-md-auto text-muted small text-md-end">
                        Showing <span className="text-dark fw-semibold">{isLoading ? 0 : filteredFoods.length}</span> items
                    </div>
                </form>

                <div className="card border-0 shadow-sm overflow-hidden bg-white" style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.03)' }}>
                    <div className="table-responsive">
                        <table className="table align-middle mb-0" style={{ minWidth: '900px' }}>                            
                            <thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #f1f5f9' }}>
                                <tr>
                                    <th className="py-3 px-4 text-secondary fw-semibold text-center uppercase tracking-wider" style={{ width: '8%', fontSize: '13px' }}>SL</th>
                                    {/* <th className="py-3 px-4 text-secondary fw-semibold uppercase tracking-wider" style={{ fontSize: '13px', width: '10%' }}>Image</th> */}
                                    <th className="py-3 px-4 text-secondary fw-semibold uppercase tracking-wider" style={{ fontSize: '13px' }}>Food Name</th>
                                    <th className="py-3 px-4 text-secondary fw-semibold uppercase tracking-wider" style={{ fontSize: '13px' }}>Category</th>
                                    <th className="py-3 px-4 text-secondary fw-semibold uppercase tracking-wider" style={{ fontSize: '13px' }}>Price (BDT)</th>
                                    <th className="py-3 px-4 text-secondary fw-semibold uppercase tracking-wider" style={{ fontSize: '13px' }}>Quantity</th>
                                    <th className="py-3 px-4 text-secondary fw-semibold uppercase tracking-wider" style={{ fontSize: '13px', width: '12%' }}>Status</th>
                                    <th className="py-3 px-4 text-secondary fw-semibold text-center uppercase tracking-wider" style={{ width: '12%', fontSize: '13px' }}>Action</th>
                                </tr>
                            </thead>
                            
                            <tbody className="border-0">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="8" className="text-center py-5">
                                            <div className="spinner-border text-warning" role="status" style={{ width: '2.5rem', height: '2.5rem' }}></div>
                                            <p className="text-muted mt-2 small fw-medium">Loading luxury kitchen vault...</p>
                                        </td>
                                    </tr>
                                ) : filteredFoods.length > 0 ? (
                                    filteredFoods.map((food, index) => (
                                        <tr key={food.id || index} className="border-bottom border-light" style={{ fontSize: '14.5px' }}>
                                            <td className="py-3 px-4 text-center">
                                                <span className="badge rounded-2 bg-light text-secondary px-2 py-2 fw-semibold" style={{ fontSize: '12px' }}>
                                                    {String(index + 1).padStart(2, '0')}
                                                </span>
                                            </td>

                                            {/* <td className="py-3 px-4">
                                                <div className="rounded-3 shadow-sm border border-light overflow-hidden bg-light" style={{ width: '52px', height: '52px' }}>
                                                    <img 
                                                        src={food.image || "https://placehold.co/100x100?text=Food"} 
                                                        alt={food.item_name} 
                                                        className="w-100 h-100 object-fit-cover"
                                                    />
                                                </div>
                                            </td> */}
                                            
                                            <td className="py-3 px-4">
                                                <span className="fw-semibold text-dark">{food.item_name}</span>
                                            </td>

                                            <td className="py-3 px-4">
                                                <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-10 px-3 py-1.5 rounded-pill fw-medium" style={{ fontSize: '12px' }}>
                                                    {food.category_name || "Unassigned"}
                                                </span>
                                            </td>

                                            <td className="py-3 px-4 text-dark fw-bold">
                                                {parseFloat(food.item_price).toFixed(2)}
                                            </td>

                                            <td className="py-3 px-4 text-secondary fw-medium">
                                                {food.item_quantity}
                                            </td>

                                            <td className="py-3 px-4">
                                                <span onClick={() => toggleAvailability(food.id, food.is_available, food.item_name)} className={`badge px-3 py-1.5 rounded-3 fw-semibold cursor-pointer text-uppercase tracking-wider d-inline-flex align-items-center gap-1`} style={{ fontSize: '11px', cursor: 'pointer',backgroundColor: food.is_available ? '#ecfdf5' : '#fef2f2', color: food.is_available ? '#059669' : '#dc2626',border: `1px solid ${food.is_available ? '#a7f3d0' : '#fecaca'}`}} title="Click to toggle availability" >
                                                    <span className="rounded-circle" style={{ width: '5px', height: '5px', backgroundColor: food.is_available ? '#059669' : '#dc2626' }}></span>
                                                    {food.is_available ? "Available" : "Out of Stock"}
                                                </span>
                                            </td>
                                            
                                            <td className="py-3 px-4 text-center">
                                                <div className="d-flex justify-content-center gap-2">
                                                    <button onClick={() => handleEdit(food.id, food.item_name, food.item_price)} className="btn rounded-3 border-0 text-dark d-inline-flex align-items-center justify-content-center shadow-sm" style={{ width: '36px', height: '36px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', transition: '0.2s' }} title="Edit Item">
                                                        <i className="bi bi-pencil fs-6"></i>
                                                    </button>
                                                    
                                                    <button onClick={() => handleDelete(food.id, food.item_name)} className="btn rounded-3 border-0 text-danger d-inline-flex align-items-center justify-content-center shadow-sm" style={{ width: '36px', height: '36px', backgroundColor: '#fff5f5', border: '1px solid #fee2e2', transition: '0.2s' }} title="Delete Item">
                                                        <i className="bi bi-trash3 fs-6"></i>
                                                    </button>                                                   
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center py-5" style={{ backgroundColor: '#fafafa' }}>
                                            <div className="py-4">
                                                <i className="bi bi-egg-fried display-5 text-muted mb-3 d-block"></i>
                                                <h5 className="fw-bold text-dark mb-1">No Food Items Match Your Search</h5>
                                                <p className="text-muted small">Try checking your query or add a new recipe to the menu.</p>
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

export default ManageFood
