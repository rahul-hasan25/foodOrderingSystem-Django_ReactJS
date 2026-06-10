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
import UserLogin from './components/UserLogin';
import FoodDetails from './pages/FoodDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import UserMyProfile from './pages/UserMyProfile';
import UserSetting from './pages/UserSetting';
import AllOrders from './pages/AllOrders';
import DateReports from './pages/DateReports';
import SearchOrder from './pages/SearchOrder';
import AdminManageUser from './pages/AdminManageUser';
import FoodMenu from './pages/FoodMenu';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={2000} style={{width: '100%',maxWidth: '600px',}} toastStyle={{whiteSpace: 'nowrap',width: 'fit-content',minWidth: '300px',}} />
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/admin-login' element={<AdminLogin/>} />
        <Route path='/admin-dashboard' element={<AdminDashboard/>} />
        <Route path='/add-category' element={<AddCategory/>} />
        <Route path='/manage-category' element={<ManageCategory/>} />
        <Route path='/add-food' element={<AddFood/>} />
        <Route path='/manage-food' element={<ManageFood/>} />
        <Route path='/all-orders' element={<AllOrders/>} />
        <Route path='/between-date-reports' element={<DateReports/>} />
        <Route path='/search/orders' element={<SearchOrder/>} />
        <Route path='/manage/users' element={<AdminManageUser/>} />

        <Route path='/search' element={<SearchPage/>} />
        <Route path='/user/register' element={<UserRegister/>} />
        <Route path='/user/login' element={<UserLogin/>} />
        <Route path='/food/:id' element={<FoodDetails/>} />
        <Route path='/cart' element={<Cart/>} />
        <Route path='/checkout' element={<Checkout/>} />
        <Route path='/my-orders' element={<MyOrders/>} />
        <Route path='/user/profile' element={<UserMyProfile/>} />
        <Route path='/user/settings' element={<UserSetting/>} />
        <Route path='/menu' element={<FoodMenu/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
