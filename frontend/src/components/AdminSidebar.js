import { useState } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
  @import url('https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.3/font/bootstrap-icons.min.css');
 
  :root { --sidebar-bg: #0f1117; --sidebar-width: 265px; --accent: #f97316; --accent-soft: rgba(249, 115, 22, 0.12); --accent-glow: rgba(249, 115, 22, 0.3); --text-primary: #f1f5f9; --text-muted: #64748b; --item-hover: rgba(255,255,255,0.05); --item-active: rgba(249, 115, 22, 0.15);--divider: rgba(255,255,255,0.07);--submenu-bg: rgba(0,0,0,0.25);--badge-bg: #f97316;}
 
  * { box-sizing: border-box; margin: 0; padding: 0; }
 
  .sidebar {width: var(--sidebar-width);min-height: 100vh;background: var(--sidebar-bg);display: flex;flex-direction: column;border-right: 1px solid var(--divider);position: relative;overflow: hidden;flex-shrink: 0;font-family: 'Poppins', sans-serif;}
 
  .sidebar::before {content: '';position: absolute;top: -80px;left: -80px;width: 260px;height: 260px;background: radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%);pointer-events: none;z-index: 0;}
 
  .sidebar-content { position: relative; z-index: 1; display: flex;flex-direction: column;height: 100%;}
 
  /* ── Profile Header ── */
  .profile-header {padding: 28px 20px 22px;display: flex;flex-direction: column;align-items: center;gap: 12px;border-bottom: 1px solid var(--divider);}
 
  .avatar-wrap {position: relative;width: 76px;height: 76px;}
 
  .avatar-ring {position: absolute;inset: -3px; border-radius: 50%;background: conic-gradient(var(--accent), #fb923c, #fbbf24, var(--accent));animation: spin 6s linear infinite;}
 
  @keyframes spin { to { transform: rotate(360deg); } }
 
  .avatar-img { position: relative; z-index: 1; width: 76px; height: 76px; border-radius: 50%; border: 3px solid var(--sidebar-bg); object-fit: cover; background: #1e2130;display: flex;align-items: center;justify-content: center;font-size: 28px;overflow: hidden;}
 
  .avatar-img img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%;}
 
  .status-dot { position: absolute; bottom: 4px; right: 4px; width: 13px; height: 13px; background: #22c55e; border-radius: 50%; border: 2px solid var(--sidebar-bg); z-index: 2;}
 
  .admin-name { font-size: 15px; font-weight: 600; color: var(--text-primary);letter-spacing: 0.3px;}
 
  .admin-role {font-size: 11px; font-weight: 500; color: var(--accent); background: var(--accent-soft);padding: 2px 10px; border-radius: 20px;letter-spacing: 0.8px;text-transform: uppercase;}
 
  /* ── Nav ── */
  .nav-section {padding: 10px 0;}
 
  .section-label {display: block;font-size: 10px;font-weight: 600;color: var(--text-muted);text-transform: uppercase;letter-spacing: 1.2px;padding: 10px 20px 6px;}
 
  /* ── Nav Item ── */
  .nav-item { display: flex; align-items: center; gap: 11px; padding: 10px 20px; cursor: pointer; color: #94a3b8; font-size: 13.5px; font-weight: 500; border-radius: 0; transition: all 0.18s ease; border-left: 3px solid transparent; user-select: none; text-decoration: none; position: relative; background: transparent; border-top: none; border-right: none; border-bottom: none; width: 100%;text-align: left;font-family: inherit;}
 
  .nav-item:hover { background: var(--item-hover);color: var(--text-primary);}
 
  .nav-item.active { background: var(--item-active); color: var(--accent); border-left-color: var(--accent);}
 
  .nav-item .nav-icon { font-size: 17px; width: 20px; text-align: center; flex-shrink: 0;}
 
  .nav-item .nav-label { flex: 1;}
 
  .nav-item .chevron {font-size: 12px;transition: transform 0.25s ease; color: var(--text-muted);}
 
  .nav-item .chevron.open { transform: rotate(180deg);color: var(--accent);}
 
  .nav-item .badge {background: var(--badge-bg);color: #fff;font-size: 10px;font-weight: 700; padding: 1px 7px; border-radius: 20px;line-height: 1.6;}
 
  /* ── Dropdown ── */
  .dropdown-wrap { overflow: hidden; max-height: 0; transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1); background: var(--submenu-bg);}
 
  .dropdown-wrap.open {max-height: max-content;}
 
  .sub-item {display: flex; align-items: center;gap: 10px;padding: 9px 20px 9px 46px; color: #64748b; font-size: 12.5px;font-weight: 400;cursor: pointer;transition: all 0.15s ease; position: relative; text-decoration: none;border-left: 3px solid transparent;}
 
  .sub-item::before {content: '';position: absolute; left: 30px; top: 50%; transform: translateY(-50%); width: 5px;height: 5px;border-radius: 50%;background: var(--text-muted);transition: background 0.15s ease;}
 
  .sub-item:hover {color: var(--text-primary);background: rgba(255,255,255,0.04);}
 
  .sub-item:hover::before {background: var(--accent);}
 
  .sub-item.active {color: var(--accent); border-left-color: var(--accent);}
 
  .sub-item.active::before {background: var(--accent);}
 
  .sub-item .sub-icon {font-size: 14px;}
 
  /* ── Divider ── */
  .nav-divider { height: 1px; background: var(--divider); margin: 8px 16px;}
`;

const AdminSidebar = () => {
  const [open, setOpen] = useState({ category: false, item: false, orders: false });
  const [active, setActive] = useState("Dashboard");

  const toggle = (key) => {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <style>{styles}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.3/font/bootstrap-icons.min.css" />

      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-content">
          {/* Profile */}
          <div className="profile-header">
            <div className="avatar-wrap">
              <div className="avatar-ring" />
              <div className="avatar-img">
                <i className="bi bi-person-fill" style={{ color: "#f97316", position: "relative", zIndex: 1 }} />
              </div>
              <div className="status-dot" />
            </div>

            <div style={{ textAlign: "center" }}>
              <div className="admin-name">Rahul Hasan</div>
              <div className="admin-role" style={{ marginTop: 5 }}>
                Super Admin
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, overflowY: "auto", paddingBottom: 8 }}>
            
            {/* SECTION: MAIN */}
            <label className="section-label">Main</label>

            <Link to='/admin-dashboard' className={`nav-item${active === "Dashboard" ? " active" : ""}`} onClick={() => setActive("Dashboard")}>
              <i className="bi bi-speedometer2 nav-icon" />
              <span className="nav-label">Dashboard</span>
            </Link>

            <Link className={`nav-item${active === "Registered Users" ? " active" : ""}`} onClick={() => setActive("Registered Users")}>
              <i className="bi bi-people-fill nav-icon" />
              <span className="nav-label">Registered Users</span>
              <span className="badge">24</span>
            </Link>

            <div className="nav-divider" />

            {/* SECTION: FOOD MANAGEMENT */}
            <label className="section-label">Food Management</label>

            {/* Dropdown: Food Category */}
            <div>
              <button 
                className={`nav-item${["Add Category", "Manage Category"].includes(active) ? " active" : ""}`} onClick={() => toggle("category")}>
                <i className="bi bi-grid-fill nav-icon" /> <span className="nav-label">Food Category</span>
                <i className={`bi bi-chevron-down chevron${open.category ? " open" : ""}`} />
              </button>
              <div className={`dropdown-wrap${open.category ? " open" : ""}`}>
                <Link to='/add-category' className={`sub-item${active === "Add Category" ? " active" : ""}`} onClick={() => setActive("Add Category")}>
                  <i className="bi bi-plus-circle sub-icon" />
                  Add Category
                </Link>

                <Link to='/manage-category' className={`sub-item${active === "Manage Category" ? " active" : ""}`} onClick={() => setActive("Manage Category")}>
                  <i className="bi bi-sliders sub-icon" />
                  Manage Category
                </Link>
              </div>
            </div>

            {/* Dropdown: Food Item */}
            <div>
              <button className={`nav-item${["Add Food Item", "Manage Food Item"].includes(active) ? " active" : ""}`} onClick={() => toggle("item")}>
                <i className="bi bi-basket3-fill nav-icon" />
                <span className="nav-label">Food Menu</span>
                <i className={`bi bi-chevron-down chevron${open.item ? " open" : ""}`} />
              </button>
              <div className={`dropdown-wrap${open.item ? " open" : ""}`}>
                <Link to='/add-food' className={`sub-item${active === "Add Food Item" ? " active" : ""}`} onClick={() => setActive("Add Food Item")}>
                  <i className="bi bi-plus-circle sub-icon" />
                  Add Food Item
                </Link>
                <Link to='/manage-food' className={`sub-item${active === "Manage Food Item" ? " active" : ""}`} onClick={() => setActive("Manage Food Item")}>
                  <i className="bi bi-list-check sub-icon" />
                  Manage Food Item
                </Link>
              </div>
            </div>

            {/* Dropdown: Orders */}
            <div>
              <button className={`nav-item${["All Orders", "Not Confirmed", "Confirmed", "Being Prepared", "Food Pickup", "Delivered", "Cancelled"].includes(active) ? " active" : ""}`} onClick={() => toggle("orders")}>
                <i className="bi bi-box-seam-fill nav-icon" />
                <span className="nav-label">Orders</span>
                <i className={`bi bi-chevron-down chevron${open.orders ? " open" : ""}`} />
              </button>
              <div className={`dropdown-wrap${open.orders ? " open" : ""}`}>
                <Link to='/all-orders' className={`sub-item${active === "All Orders" ? " active" : ""}`} onClick={() => setActive("All Orders")}>
                  <i className="bi bi-clipboard-data text-secondary sub-icon" /> All Orders
                </Link>

                <Link href="#manage-food" className={`sub-item${active === "Confirmed" ? " active" : ""}`} onClick={(e) => { e.preventDefault(); setActive("Confirmed"); }}>
                  <i className="bi bi-patch-check-fill text-success sub-icon" /> Confirmed
                </Link>

                <Link href="#add-food" className={`sub-item${active === "Not Confirmed" ? " active" : ""}`} onClick={(e) => { e.preventDefault(); setActive("Not Confirmed"); }}>
                  <i className="bi bi-patch-exclamation text-danger sub-icon" /> Not Confirmed
                </Link>

                <Link href="#manage-food" className={`sub-item${active === "Being Prepared" ? " active" : ""}`} onClick={(e) => { e.preventDefault(); setActive("Being Prepared"); }}>
                  <i className="bi bi-gear-wide-connected text-info animate-spin sub-icon" /> Being Prepared
                </Link>

                <Link href="#manage-food" className={`sub-item${active === "Food Pickup" ? " active" : ""}`} onClick={(e) => { e.preventDefault(); setActive("Food Pickup"); }}>
                  <i className="bi bi-box-seam text-secondary sub-icon" /> Food Pickup
                </Link>

                <Link href="#manage-food" className={`sub-item${active === "Delivered" ? " active" : ""}`} onClick={(e) => { e.preventDefault(); setActive("Delivered"); }}>
                  <i className="bi bi-bag-check-fill text-success sub-icon" /> Delivered
                </Link>

                <Link href="#manage-food" className={`sub-item${active === "Cancelled" ? " active" : ""}`} onClick={(e) => { e.preventDefault(); setActive("Cancelled"); }}>
                  <i className="bi bi-x-circle-fill text-danger sub-icon" /> Cancelled
                </Link>
              </div>
            </div>

            <div className="nav-divider" />

            {/* SECTION: TOOLS */}
            <label className="section-label">Tools</label>

            <Link href="#search" className={`nav-item${active === "Between Date Reports" ? " active" : ""}`} onClick={(e) => { e.preventDefault(); setActive("Between Date Reports"); }}>
              <i className="bi bi-calendar-check text-secondary nav-icon" />
              <span className="nav-label">Between Date Reports</span>
            </Link>

            <Link href="#search" className={`nav-item${active === "Search" ? " active" : ""}`} onClick={(e) => { e.preventDefault(); setActive("Search"); }}>
              <i className="bi bi-search nav-icon" />
              <span className="nav-label">Search</span>
            </Link>

            <Link href="#reviews" className={`nav-item${active === "Manage Reviews" ? " active" : ""}`} onClick={(e) => { e.preventDefault(); setActive("Manage Reviews"); }}>
              <i className="bi bi-chat-square-text-fill nav-icon" />
              <span className="nav-label">Manage Reviews</span>
              <span className="badge">7</span>
            </Link>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;