import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, formatVND } from '../App'
import { toast } from 'react-toastify'

const Dashboard = ({ token }) => {

  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, users: 0, pending: 0 })
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {

      const [prodRes, orderRes, userRes] = await Promise.all([
        axios.get(backendUrl + '/api/product/list'),
        axios.post(backendUrl + '/api/order/list', {}, { headers: { token } }),
        axios.post(backendUrl + '/api/user/list', {}, { headers: { token } }),
      ])

      const products = prodRes.data.products || []
      const orders = orderRes.data.orders || []
      const users = userRes.data.users || []

      const revenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0)
      const pending = orders.filter(o => o.status !== 'Delivered').length

      setStats({
        products: products.length,
        orders: orders.length,
        revenue,
        users: users.length,
        pending
      })

      setRecent([...orders].reverse().slice(0, 5))

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [token])

  const cards = [
    { label: 'Products', value: stats.products },
    { label: 'Orders', value: stats.orders },
    { label: 'Revenue', value: formatVND(stats.revenue) },
    { label: 'Users', value: stats.users },
    { label: 'Pending Orders', value: stats.pending },
  ]

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <p className='mb-4'>Dashboard</p>

      {/* ------- Stat cards ------- */}
      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8'>
        {cards.map((c, i) => (
          <div key={i} className='border bg-white p-4 rounded'>
            <p className='text-sm text-gray-500'>{c.label}</p>
            <p className='text-xl font-semibold mt-1'>{c.value}</p>
          </div>
        ))}
      </div>

      {/* ------- Recent orders ------- */}
      <p className='mb-2'>Recent Orders</p>
      <div className='flex flex-col gap-2'>
        <div className='hidden sm:grid grid-cols-[2fr_2fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
          <b>Customer</b>
          <b>Items</b>
          <b>Amount</b>
          <b>Status</b>
          <b>Date</b>
        </div>

        {recent.length === 0 && (
          <p className='text-sm text-gray-400 py-2'>No orders yet.</p>
        )}

        {recent.map((order, i) => (
          <div key={i} className='grid grid-cols-1 sm:grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-1 sm:gap-2 py-2 px-2 border text-sm'>
            <p>{order.address.firstName + ' ' + order.address.lastName}</p>
            <p className='text-gray-500'>{order.items.map(it => `${it.name} x${it.quantity}`).join(', ')}</p>
            <p>{formatVND(order.amount)}</p>
            <p>{order.status}</p>
            <p>{new Date(order.date).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
