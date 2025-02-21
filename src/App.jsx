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
import { UserProvider } from './context/UserContext'; 
import 'react-toastify/dist/ReactToastify.css';
import Settings from './pages/Settings';
import ManageUsers from './pages/ManageUsers';
import Spaces from "./pages/Spaces";

function App() {
  return (
    <BrowserRouter>
      <UserProvider> {/* Ensure the whole app has UserProvider */}
        <Routes>
          <Route path="/" element={<Layout />}> 
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="about" element={<About />} />
            <Route path="profile" element={<Profile />} />
            <Route path="manage-spaces" element={<ManageSpace />} />
            <Route path="manage-bookings" element={<ManageBooking />} />
            <Route path="settings" element={<Settings />} />
            <Route path="manage-users" element={<ManageUsers />} />
            <Route path="spaces" element={<Spaces />} />

            {/* Catch-all route for 404 pages */}
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
