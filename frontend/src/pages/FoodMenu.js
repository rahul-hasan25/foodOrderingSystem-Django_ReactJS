import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Button, Pagination, Badge, Spinner } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import PublicLayout from './../components/PublicLayout';

const FoodMenu = () => {
    const [foodItems, setFoodItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(2000);
    const [currentPage, setCurrentPage] = useState(1);
    const [paginationData, setPaginationData] = useState({ total_pages: 1, count: 0 });

    const [surpriseItem, setSurpriseItem] = useState(null);
    const [rolling, setRolling] = useState(false);

    const navigate = useNavigate();

    const fetchMenuCatalog = useCallback(async () => {
        setLoading(true);
        try {
            const url = `http://127.0.0.1:8000/api/menu/?search=${encodeURIComponent(search)}&category=${selectedCategory}&min_price=${minPrice}&max_price=${maxPrice}&page=${currentPage}`;
            const response = await axios.get(url);
            setFoodItems(response.data.results);
            setPaginationData(response.data.pagination);
            setCategories(response.data.categories);
        } catch (error) {
            toast.error("Failed to compile item arrays from kitchen microservice.");
        } finally {
            setLoading(false);
        }
    }, [search, selectedCategory, maxPrice, currentPage]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchMenuCatalog();
        }, 400);
        return () => clearTimeout(delayDebounce);
    }, [search, fetchMenuCatalog]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, minPrice, maxPrice]);

    useEffect(() => {
        fetchMenuCatalog();
    }, [currentPage, fetchMenuCatalog]);

    const triggerSurpriseWheel = () => {
        if (foodItems.length === 0) {
            toast.info("No active food selections discoverable under parameters.");
            return;
        }
        setRolling(true);
        setSurpriseItem(null);
        
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * foodItems.length);
            setSurpriseItem(foodItems[randomIndex]);
            setRolling(false);
        }, 800);
    };

    const renderPaginationItems = () => {
        let items = [];
        for (let number = 1; number <= paginationData.total_pages; number++) {
            items.push(
                <Pagination.Item key={number} active={number === currentPage} onClick={() => setCurrentPage(number)}>
                    {number}
                </Pagination.Item>
            );
        }
        return items;
    };
  return (
    <PublicLayout>
        <div className="style-scope-menu-catalog min-vh-100 pb-5">
            <ToastContainer position="bottom-right" autoClose={2000} theme="colored" />

            <div className="menu-hero-strip text-center text-white py-4 px-3 mb-4 position-relative">
                <Badge bg="warning" text="dark" className="text-uppercase tracking-wider font-monospace px-2.5 py-1 mb-2 fs-xxs">
                    Gourmet Discovery Space
                </Badge>
                <h1 className="fw-black tracking-tight fs-4 m-0 text-white">FoodExpress Master Menu</h1>
                <p className="text-white-50 mx-auto mt-1 fs-xs max-w-500">
                    Discover hand-selected delicacies, customize active sorting threshold filters, and claim discount offers instantly.
                </p>
                
                <div className="mt-3 d-flex justify-content-center align-items-center flex-column">
                    <Button variant="outline-light" size="sm" className="fs-xxs fw-bold rounded-pill tracking-wider px-3 py-1.5 surprise-btn" onClick={triggerSurpriseWheel} disabled={rolling}>
                        {rolling ? <Spinner animation="border" size="sm" className="me-1" /> : <i className="bi bi-magic me-1"></i>} 
                        CAN'T DECIDE? SURPRISE ME!
                    </Button>
                    
                    {surpriseItem && (
                        <div className="surprise-reveal-card mt-3 p-2 rounded-3 border bg-white text-dark d-flex align-items-center gap-2 animate-fade-in shadow-sm">
                            <span className="fs-xs">🎯 Try our recommended dish: <strong>{surpriseItem.item_name}</strong> (${Number(surpriseItem.item_price).toFixed(2)})</span>
                            <Button variant="dark" size="sm" className="fs-xxs px-2 py-0.5 rounded-2" onClick={() => navigate(`/food/${surpriseItem.id}`)}>
                                Order Item
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <Container className="px-3">
                <Card className="border-0 shadow-sm p-3 bg-white mb-4">
                    <Row className="g-3 align-items-end">
                        <Col xs={12} md={5}>
                            <Form.Group>
                                <Form.Label className="text-uppercase tracking-wide text-secondary fw-bold fs-xxs mb-1.5">
                                    <i className="bi bi-search me-1"></i> Scan Dish Index
                                </Form.Label>
                                <Form.Control type="text" className="custom-placeholder form-control-sm border-1 fs-xs px-3 py-2 bg-light shadow-inner text-dark" placeholder="Search recipes, ingredients, tags (ex: Burger, Spicy...)" value={search} onChange={(e) => setSearch(e.target.value)}/>
                            </Form.Group>
                        </Col>

                        <Col xs={12} sm={6} md={4}>
                            <Form.Group>
                                <Form.Label className="text-uppercase tracking-wide text-secondary fw-bold fs-xxs mb-1.5">
                                    <i className="bi bi-funnel me-1"></i> Category Node
                                </Form.Label>
                                <Form.Select className="form-select-sm border-1 fs-xs py-2 bg-light text-dark" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                                    <option value="">All Categories Displayed</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col xs={12} sm={6} md={3}>
                            <Form.Group>
                                <Form.Label className="text-uppercase tracking-wide text-secondary fw-bold fs-xxs mb-1.5">
                                    <i className="bi bi-currency-dollar me-0.5"></i> Price Range (TK)
                                </Form.Label>
                                <div className="d-flex align-items-center gap-1.5">
                                    <Form.Control type="number" min="0" max="2000" className="form-control-sm border-1 fs-xxs p-1.5 bg-light text-dark font-monospace text-center" placeholder="Lower Price" value={minPrice} onChange={(e) => setMinPrice(Math.max(0, parseInt(e.target.value) || 0))}/>
                                    <span className="text-muted fs-xxs font-monospace m-1">to</span>
                                    <Form.Control type="number" min="0" max="2000" className="form-control-sm border-1 fs-xxs p-1.5 bg-light text-dark font-monospace text-center" placeholder="Upper Price" value={maxPrice} onChange={(e) => setMaxPrice(Math.min(2000, parseInt(e.target.value) || 0))}/>
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>
                </Card>

                {/* Main Food Items Container */}
                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="dark" size="sm" className="mb-2" />
                        <p className="text-muted italic fs-xs font-monospace">Synchronizing kitchen catalog array arrays...</p>
                    </div>
                ) : foodItems.length === 0 ? (
                    <div className="card text-center py-5 border-dashed bg-white rounded-3 shadow-xs">
                        <i className="bi bi-egg-slash fs-1 text-muted mb-2"></i>
                        <h5 className="fw-bold fs-xs text-dark text-uppercase m-0">No Recipes Matched</h5>
                        <p className="text-secondary fs-xxs mt-1 mb-0">Adjust active parameter filters above to load matching results maps.</p>
                    </div>
                ) : (
                    <>
                        <Row className="g-3 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
                            {foodItems.map((item) => (
                                <Col key={item.id}>
                                    <Card className={`border-0 shadow-sm rounded-3 h-100 bg-white menu-item-card overflow-hidden d-flex flex-column justify-content-between position-relative ${!item.is_available ? 'opacity-75' : ''}`}>
                                        {/* Dynamic Discount or Sold Out Badge Overlay Layer */}
                                        {!item.is_available ? (
                                            <Badge bg="secondary" className="position-absolute top-0 start-0 m-2.5 z-index-2 font-monospace fs-xxs px-2.5 py-1 shadow-xs rounded-1 text-uppercase tracking-wider fw-bold">
                                                🚫 Sold Out
                                            </Badge>
                                        ) : item.discount_price && (
                                            <Badge bg="danger" className="position-absolute top-0 start-0 m-2.5 z-index-2 font-monospace fs-xxs px-2 py-1 shadow-xs rounded-1">
                                                SAVE ${(Number(item.item_price) - Number(item.discount_price)).toFixed(0)}
                                            </Badge>
                                        )}

                                        <div>
                                            <div className="image-aspect-wrapper bg-light position-relative overflow-hidden">
                                                <img src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60"} alt={item.item_name} className="w-100 h-100 object-fit-cover item-zoom-transition"/>
                                                <div className="position-absolute bottom-0 end-0 m-2 bg-dark-alpha backdrop-blur rounded px-2 py-0.5 d-flex align-items-center gap-1 text-white fs-xxs font-monospace shadow-xs">
                                                    ⏱️ {item.preparation_time}m
                                                </div>
                                            </div>

                                            <div className="p-3">
                                                <div className="d-flex justify-content-between align-items-start gap-1 mb-1">
                                                    <h3 className="m-0 fw-bold fs-xs text-slate-900 text-truncate max-w-80">{item.item_name}</h3>
                                                    <span className="badge bg-slate-100 text-slate-700 fs-xxs px-1.5 py-0.5 rounded-1 font-monospace">{item.item_quantity}</span>
                                                </div>

                                                <div className="d-flex align-items-center gap-1 mb-2 fs-xxs text-warning font-semibold">
                                                    <span>★ {item.average_rating ? Number(item.average_rating).toFixed(1) : "5.0"}</span>
                                                    <span className="text-muted font-normal">({item.review_count || 0} reviews)</span>
                                                </div>

                                                <p className="text-secondary fs-xxs line-clamp-2 mb-2.5 min-h-30">
                                                    {item.item_description || "Premium freshly prepared delicacy optimized with standard ingredients and authentic combinations."}
                                                </p>

                                                {/* Parsing comma separated nutritional tags */}
                                                <div className="d-flex flex-wrap gap-1 mb-1">
                                                    {(item.dietary_tags || "Fresh").split(',').map((tag, tIdx) => (
                                                        <span key={tIdx} className="dietary-micro-tag text-capitalize font-monospace">{tag.trim()}</span>
                                                    ))}
                                                    {item.calories && <span className="dietary-micro-tag calorie-tag font-monospace">🔥 {item.calories} kcal</span>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-3 pt-0 bg-white border-0">
                                            <div className="d-flex align-items-center justify-content-between pt-2 border-top border-light">
                                                <div>
                                                    {item.discount_price && item.is_available ? (
                                                        <div className="d-flex flex-column">
                                                            <span className="fw-black text-emerald fs-xs font-monospace">${Number(item.discount_price).toFixed(2)}</span>
                                                            <span className="text-muted text-decoration-line-through fs-xxs font-monospace">${Number(item.item_price).toFixed(2)}</span>
                                                        </div>
                                                    ) : (
                                                        <span className={`fw-black fs-xs font-monospace ${!item.is_available ? 'text-muted text-decoration-line-through' : 'text-slate-900'}`}>
                                                            ${Number(item.item_price).toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                {item.is_available ? (
                                                    <Button variant="dark" size="sm" className="fs-xxs px-2.5 py-1 fw-bold rounded-2 d-flex align-items-center gap-1 shadow-sm custom-add-cart-btn" onClick={() => navigate(`/food/${item.id}`)}>
                                                        <i className="bi bi-eye-fill"></i> View
                                                    </Button>
                                                ) : (
                                                    <Button variant="light" size="sm" className="fs-xxs px-2.5 py-1 fw-medium rounded-2 text-muted border-0" disabled>
                                                        Unavailable
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        {/* Pagination control layer */}
                        {paginationData.total_pages > 1 && (
                            <div className="d-flex justify-content-center align-items-center mt-5 custom-bootstrap-pagination">
                                <Pagination size="sm">
                                    <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                                    <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                                    {renderPaginationItems()}
                                    <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, paginationData.total_pages))} disabled={currentPage === paginationData.total_pages} />
                                    <Pagination.Last onClick={() => setCurrentPage(paginationData.total_pages)} disabled={currentPage === paginationData.total_pages} />
                                </Pagination>
                            </div>
                        )}
                    </>
                )}
            </Container>

            <style>{`
                .style-scope-menu-catalog {background-color: #f8fafc !important; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important; letter-spacing: -0.012em;}
                .fs-xs { font-size: 0.825rem !important; }
                .fs-xxs { font-size: 0.72rem !important; }
                .text-slate-900 { color: #0f172a !important; }
                .text-slate-700 { color: #334155 !important; }
                .text-emerald { color: #059669 !important; }
                .bg-slate-100 { background-color: #f1f5f9 !important; }
                
                .menu-hero-strip {background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);box-shadow: inset 0 -10px 20px rgba(0,0,0,0.02);}
                .max-w-500 { max-width: 500px; }
                .surprise-btn {border-color: rgba(255,255,255,0.25);transition: all 0.2s ease;}
                .surprise-btn:hover {background-color: white !important;color: #0f172a !important;box-shadow: 0 4px 12px rgba(255,255,255,0.15);}
                .surprise-reveal-card {min-width: 280px; animation: slideUpReveal 0.3s ease;}

                .menu-item-card {border: 1px solid #e2e8f0 !important;transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease;}
                .menu-item-card:hover {transform: translateY(-3px);box-shadow: 0 8px 20px -4px rgba(15,23,42,0.08) !important;}
                .image-aspect-wrapper {height: 155px;width: 100%;}
                .bg-dark-alpha { background-color: rgba(15, 23, 42, 0.65); }
                .backdrop-blur { backdrop-filter: blur(4px); }
                .item-zoom-transition { transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
                .menu-item-card:hover .item-zoom-transition { transform: scale(1.04); }
                
                .min-h-30 { min-height: 30px; }
                .max-w-80 { max-width: 80%; }
                .max-w-140 { max-width: 140px; }

                .dietary-micro-tag {font-size: 0.65rem; background-color: #f1f5f9; color: #475569; padding: 2px 6px; border-radius: 4px; font-weight: 500;}
                .calorie-tag {background-color: #fff7ed;color: #ea580c;}
                .custom-add-cart-btn {padding: 5px 12px !important;transition: background-color 0.15s ease;}
                .custom-add-cart-btn:hover { background-color: #1e293b !important; }

                .custom-bootstrap-pagination .page-link {color: #334155 !important;font-size: 0.75rem !important;padding: 5px 10px; border: 1px solid #e2e8f0;font-family: monospace;}
                .custom-bootstrap-pagination .page-item.active .page-link { background-color: #0f172a !important; border-color: #0f172a !important; color: white !important;}
                
                @keyframes slideUpReveal { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; }}
                .animate-fade-in { animation: slideUpReveal 0.25s ease-out; }
                
                .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;}
                .custom-placeholder::placeholder {color: #94a3b8 !important;opacity: 1 !important;}`}
            </style>
        </div>
    </PublicLayout>
  )
}

export default FoodMenu
