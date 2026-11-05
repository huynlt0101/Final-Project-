import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Dashboard from './pages/Dashboard'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'


export const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'
export const currency = '$'

const App = () => {
  const [token, setToken] = useState('')
  return (
    <div className='min-h-screen bg-white text-gray-600 text-base'>
      <Navbar setToken={setToken} />
      <div className='flex w-full items-start'>
        <Sidebar />
        <main className='flex-1 min-w-0'>
          <div className='max-w-5xl mx-auto px-4 sm:px-8 py-8'>
            <Routes>
              <Route path='/' element={<Navigate to='/dashboard' replace />} />
              <Route path='/dashboard' element={<Dashboard token={token} />} />
              <Route path='/add' element={<Add token={token} />} />
              <Route path='/list' element={<List token={token} />} />
              <Route path='/orders' element={<Orders token={token} />} />
            </Routes>
          </div>
        </main>
      </div>
      <ToastContainer position='bottom-center' autoClose={3000} />
    </div>
  )
}

export default App
