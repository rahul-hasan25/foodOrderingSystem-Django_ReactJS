import React from 'react'
import '../styles/adminlogin.css'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'

const AdminLayout = ({children}) => {
  return (
    <div className='d-flex'>
      <AdminSidebar/>
      <div id='page-content-wrapper'>
        <AdminHeader/>
        <div className='container-fluid mt-4'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
