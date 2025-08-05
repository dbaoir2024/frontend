import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginForm from './components/auth/LoginForm'
import Dashboard from './components/dashboard/Dashboard'
import ResetPassword from './components/auth/ResetPassword'
import Register from './components/auth/Register'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />
        {/* Add more routes as needed */}
        <Route path="*" element={<div>404 Not Found</div>} /> 
      </Routes>
    </BrowserRouter>
  );
}


export default App
