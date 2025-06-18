import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginForm from './components/auth/LoginForm'
import Dashboard from './components/dashboard/Dashboard'
import ResetPassword from './components/auth/ResetPassword'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App
