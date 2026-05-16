import React, {useState, useEffect} from 'react';
import '../styles/adminlogin.css'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'

const AdminLayout = ({children}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(()=>{
    const handleResize = () => {
      if(window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    }
    handleResize();

    window.addEventListener('resize', handleResize);

    return ()=> window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <div className='d-flex'>
      {sidebarOpen && <AdminSidebar/>}
      <div id='page-content-wrapper' className={`flex-grow-1 ${sidebarOpen ? 'with-sidebar' : 'full-width'}`}>
        <AdminHeader/>
        <div className='container-fluid mt-4'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
