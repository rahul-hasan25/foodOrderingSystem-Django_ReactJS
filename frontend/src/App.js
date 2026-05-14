import {BrowserRouter, Routes, Route} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { ToastContainer } from 'react-toastify'
import "react-toastify/ReactToastify.css"
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position='top-right' autoClose={2000} />
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/admin-login' element={<AdminLogin/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
