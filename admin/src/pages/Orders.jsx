import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const statusOptions = ['Order Placed', 'Packing', 'Shipped', 'Out for delivery', 'Delivered']

const Orders = ({ token }) => {

  const [orders, setOrders] = useState([])
  const [state, setState] = useState('loading')

  const fetchAllOrders = async () => {
    if (!token) {
      setState('logged-out')
      return
    }
    setState('loading')
    try {
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) {
        setOrders(response.data.orders.reverse())
        setState('ready')
      } else {
        toast.error(response.data.message)
        setState('error')
      }
    } catch (error) {
      toast.error(error.message)
      setState('error')
    }
  }

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/order/status',
        { orderId, status: event.target.value },
        { headers: { token } }
      )
      if (response.data.success) {
        await fetchAllOrders()
        toast.success('Status updated')
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [token])

  return (
    <div className='flex flex-col gap-6'>
      <div className='border-b border-black pb-4'>
        <h1 className='text-2xl font-semibold tracking-tight text-black'>Orders</h1>
        <p className='text-sm text-gray-600 mt-1'>
          {state === 'ready'
            ? `${orders.length} order${orders.length === 1 ? '' : 's'}`
            : 'Fulfillment queue'}
        </p>
      </div>

      {state === 'logged-out' ? (
        <div className='card p-8'>
          <p className='text-sm font-medium text-black'>Login to see orders</p>
          <p className='text-sm text-gray-600 mt-1'>Order activity appears here after you log in.</p>
        </div>
      ) : state === 'loading' ? (
        <p className='text-sm text-gray-600' role='status'>Loading orders…</p>
      ) : state === 'error' ? (
        <div className='card p-8'>
          <p className='text-sm font-medium text-black' role='alert'>Could not load orders</p>
          <button
            type='button'
            onClick={fetchAllOrders}
            className='mt-2 text-sm font-medium text-black underline underline-offset-4 hover:text-gray-600'
          >
            Try again
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className='card p-8'>
          <p className='text-sm font-medium text-black'>No orders yet</p>
          <p className='text-sm text-gray-600 mt-1'>New orders will appear here.</p>
        </div>
      ) : (
        <div className='flex flex-col gap-3'>
          {orders.map((order, index) => (
            <article
              className='card p-5 md:p-6 grid grid-cols-1 sm:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr_auto_auto] gap-4 lg:gap-6 items-start'
              key={order._id || index}
            >
              <img className='w-10 h-10' src={assets.parcel_icon} alt='' aria-hidden='true' />

              <div className='min-w-0 text-sm text-gray-700'>
                <div className='text-black'>
                  {order.items.map((item, i) => (
                    <p className='py-0.5' key={i}>
                      {item.name} × {item.quantity}
                      <span className='text-gray-600'> {item.size}</span>
                      {i < order.items.length - 1 ? ',' : ''}
                    </p>
                  ))}
                </div>
                <p className='mt-3 font-medium text-black'>
                  {order.address.firstName} {order.address.lastName}
                </p>
                <p className='text-gray-600'>{order.address.street}</p>
                <p className='text-gray-600'>
                  {order.address.city}, {order.address.state}, {order.address.country} {order.address.zipcode}
                </p>
                <p className='text-gray-600'>{order.address.phone}</p>
              </div>

              <div className='text-sm space-y-1.5 text-gray-700'>
                <p><span className='text-gray-500'>Items</span> · <span className='text-black font-medium tabular-nums'>{order.items.length}</span></p>
                <p><span className='text-gray-500'>Pay method</span> · <span className='text-black font-medium'>{order.paymentMethod}</span></p>
                <p>
                  <span className='text-gray-500'>Payment</span> ·{' '}
                  <span className={`font-medium ${order.payment ? 'text-black' : 'text-gray-500'}`}>
                    {order.payment ? 'Paid' : 'Pending'}
                  </span>
                </p>
                <p><span className='text-gray-500'>Date</span> · <span className='text-black'>{new Date(order.date).toLocaleDateString()}</span></p>
                <p className='text-lg font-semibold text-black tabular-nums'>{currency}{order.amount}</p>
              </div>

              <div className='w-full lg:w-44'>
                <label htmlFor={`status-${order._id}`} className='block text-xs text-gray-500 mb-1.5'>
                  Status
                </label>
                <select
                  id={`status-${order._id}`}
                  onChange={(event) => statusHandler(event, order._id)}
                  value={order.status}
                  className='w-full px-3 py-2 rounded-md text-sm font-medium bg-white'
                >
                  {statusOptions.map((status) => (
                    <option value={status} key={status}>{status}</option>
                  ))}
                </select>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders
