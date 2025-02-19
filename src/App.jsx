import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Bookings from './pages/Bookings'
import Home from './pages/Home'
import Login from './pages/Login'
import NoPage from './pages/NoPage'
import Profile from './pages/Profile'
import Register from './pages/Register'
import About from './pages/About'
import AdminForm from './pages/AdminForm'
import AddSpace from './pages/AddSpace'

function App() {

  return (
  
      <BrowserRouter>
          <Routes>
            <Route path = "/" element={<Layout />} >             
                <Route index element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<About />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/AdminForm" element={<AdminForm />} />
                <Route path="/addspace" element={<AddSpace />} />
                <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
    </BrowserRouter>
  )
}

export default App
