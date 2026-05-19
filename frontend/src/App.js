import {BrowserRouter, Routes, Route} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { ToastContainer } from 'react-toastify'
import "react-toastify/ReactToastify.css"
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AddCategory from './pages/AddCategory';
import ManageCategory from './pages/ManageCategory';
import AddFood from './pages/AddFood';
import ManageFood from './pages/ManageFood';
import SearchPage from './pages/SearchPage';
import UserRegister from './components/UserRegister';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position='top-right' autoClose={2000} />
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/admin-login' element={<AdminLogin/>} />
        <Route path='/admin-dashboard' element={<AdminDashboard/>} />
        <Route path='/add-category' element={<AddCategory/>} />
        <Route path='/manage-category' element={<ManageCategory/>} />
        <Route path='/add-food' element={<AddFood/>} />
        <Route path='/manage-food' element={<ManageFood/>} />
        <Route path='/search' element={<SearchPage/>} />
        <Route path='/user/register' element={<UserRegister/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
