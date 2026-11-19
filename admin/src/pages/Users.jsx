import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Users = ({ token }) => {

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    try {

      const response = await axios.post(backendUrl + '/api/user/list', {}, { headers: { token } })
      if (response.data.success) {
        setUsers(response.data.users)
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleStatus = async (id) => {
    try {

      const response = await axios.post(backendUrl + '/api/user/toggle-status', { id }, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        setUsers(prev => prev.map(u => u._id === id ? { ...u, active: response.data.active } : u))
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [token])

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <p className='mb-4'>Users</p>

      <div className='flex flex-col gap-2'>

        <div className='hidden sm:grid grid-cols-[2fr_3fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
          <b>Name</b>
          <b>Email</b>
          <b>Status</b>
          <b className='text-center'>Action</b>
        </div>

        {users.length === 0 && (
          <p className='text-sm text-gray-400 py-2'>No users yet.</p>
        )}

        {users.map(user => (
          <div key={user._id} className='grid grid-cols-1 sm:grid-cols-[2fr_3fr_1fr_1fr] gap-1 sm:gap-2 py-2 px-2 border text-sm items-center'>
            <p>{user.name}</p>
            <p className='text-gray-500'>{user.email}</p>
            <p>
              <span className={`px-2 py-1 rounded text-xs ${user.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {user.active ? 'Active' : 'Inactive'}
              </span>
            </p>
            <div className='sm:text-center'>
              <button
                onClick={() => toggleStatus(user._id)}
                className={`px-3 py-1 text-xs border rounded ${user.active ? 'text-red-600 border-red-300' : 'text-green-600 border-green-300'}`}
              >
                {user.active ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}

      </div>
    </div>
  )
}

export default Users
