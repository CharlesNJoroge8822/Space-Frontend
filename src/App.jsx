import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import NoPage from './pages/NoPage';
import Profile from './pages/Profile';
import Register from './pages/Register';
import About from './pages/About';
import ManageSpace from './pages/ManageSpace';
import ManageBooking from './pages/ManageBooking';
import { UserProvider } from './context/UserContext'; // Import the UserProvider
// import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import Settings from './pages/Settings';
import ManageUsers from './pages/ManageUsers';
import Spaces from "./pages/Spaces"

function App() {
  return (
    <BrowserRouter>
      <UserProvider> {/* Wrap the entire app in UserProvider */}
        <Routes>
          <Route path="/" element={<Layout />} >
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/manage-spaces" element={<ManageSpace />} />
            <Route path="/manage-bookings" element={<ManageBooking />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/manage-users" element={<ManageUsers />} />
            <Route path="/spaces" element={<Spaces />} />

\            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
