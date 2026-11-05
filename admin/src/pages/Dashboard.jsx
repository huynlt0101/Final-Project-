import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { NavLink } from 'react-router-dom'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

// Set to false to load live data from the backend.
const USE_SAMPLE_DATA = true

const SAMPLE_PRODUCTS = [
  { _id: 'p1', name: 'Oversized Cotton Tee', category: 'Men', bestseller: true },
  { _id: 'p2', name: 'Relaxed Fit Chinos', category: 'Men', bestseller: false },
  { _id: 'p3', name: 'Heavyweight Hoodie', category: 'Men', bestseller: true },
  { _id: 'p4', name: 'Striped Linen Shirt', category: 'Men', bestseller: false },
  { _id: 'p5', name: 'Slim Selvedge Jeans', category: 'Men', bestseller: false },
  { _id: 'p6', name: 'Pleated Midi Skirt', category: 'Women', bestseller: true },
  { _id: 'p7', name: 'Ribbed Knit Cardigan', category: 'Women', bestseller: false },
  { _id: 'p8', name: 'Satin Slip Dress', category: 'Women', bestseller: false },
  { _id: 'p9', name: 'High-Rise Straight Jeans', category: 'Women', bestseller: false },
  { _id: 'p10', name: 'Fleece Zip Jacket', category: 'Kids', bestseller: false },
  { _id: 'p11', name: 'Printed Cotton Set', category: 'Kids', bestseller: false },
  { _id: 'p12', name: 'Canvas Sneakers', category: 'Kids', bestseller: false },
]

const SAMPLE_ORDERS = [
  { _id: 'o1', amount: 129.0, payment: true, status: 'Delivered', date: '2026-10-21T10:24:00', address: { firstName: 'Sofia', lastName: 'Reyes' } },
  { _id: 'o2', amount: 89.5, payment: true, status: 'Delivered', date: '2026-10-26T15:40:00', address: { firstName: 'James', lastName: 'Carter' } },
  { _id: 'o3', amount: 214.25, payment: false, status: 'Shipped', date: '2026-10-31T09:12:00', address: { firstName: 'Linh', lastName: 'Nguyen' } },
  { _id: 'o4', amount: 46.0, payment: true, status: 'Packing', date: '2026-11-01T18:05:00', address: { firstName: 'Emma', lastName: 'Davis' } },
  { _id: 'o5', amount: 312.75, payment: true, status: 'Out for delivery', date: '2026-11-03T11:47:00', address: { firstName: 'Raj', lastName: 'Patel' } },
  { _id: 'o6', amount: 74.99, payment: false, status: 'Order Placed', date: '2026-11-04T08:30:00', address: { firstName: 'Minh Anh', lastName: 'Tran' } },
  { _id: 'o7', amount: 158.4, payment: true, status: 'Order Placed', date: '2026-11-05T07:15:00', address: { firstName: 'Noah', lastName: 'Williams' } },
]

const statusStyles = {
  'Delivered': 'bg-black text-white border-black',
  'Out for delivery': 'bg-gray-800 text-white border-gray-800',
  'Shipped': 'bg-gray-300 text-gray-900 border-gray-400',
  'Packing': 'bg-gray-100 text-gray-700 border-gray-400',
  'Order Placed': 'bg-white text-gray-600 border-gray-300',
}

const TODAY_LABEL = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

const formatMoney = (value) =>
  value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const viewAllLink = 'text-xs font-medium text-black underline underline-offset-4 hover:text-gray-600'

const Dashboard = ({ token }) => {

  const [products, setProducts] = useState(USE_SAMPLE_DATA ? SAMPLE_PRODUCTS : [])
  const [orders, setOrders] = useState(USE_SAMPLE_DATA ? SAMPLE_ORDERS : [])
  const [productsState, setProductsState] = useState(USE_SAMPLE_DATA ? 'ready' : 'loading')
  const [ordersState, setOrdersState] = useState(
    USE_SAMPLE_DATA ? 'ready' : token ? 'loading' : 'logged-out'
  )
  const [ordersError, setOrdersError] = useState('')

  const fetchProducts = async () => {
    setProductsState('loading')
    try {
      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setProducts(response.data.products)
        setProductsState('ready')
      } else {
        setProductsState('error')
      }
    } catch {
      setProductsState('error')
    }
  }

  const fetchOrders = async () => {
    if (!token) {
      setOrdersState('logged-out')
      return
    }
    setOrdersState('loading')
    setOrdersError('')
    try {
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) {
        setOrders(response.data.orders)
        setOrdersState('ready')
      } else {
        setOrdersState('error')
        setOrdersError(response.data.message || 'Could not load orders')
      }
    } catch (error) {
      setOrdersState('error')
      setOrdersError(error.response?.data?.message || error.message)
      toast.error(error.response?.data?.message || error.message)
    }
  }

  useEffect(() => {
    if (USE_SAMPLE_DATA) return
    fetchProducts()
  }, [])

  useEffect(() => {
    if (USE_SAMPLE_DATA) return
    fetchOrders()
  }, [token])

  const productsReady = productsState === 'ready'
  const ordersReady = ordersState === 'ready'

  const totalRevenue = orders
    .filter((order) => order.payment)
    .reduce((sum, order) => sum + order.amount, 0)

  const paidOrders = orders.filter((order) => order.payment).length
  const bestsellerCount = products.filter((product) => product.bestseller).length

  const categoryStats = ['Men', 'Women', 'Kids'].map((category) => ({
    name: category,
    count: products.filter((product) => product.category === category).length,
  }))

  const maxCategoryCount = Math.max(...categoryStats.map((c) => c.count), 1)

  const recentOrders = [...orders].reverse().slice(0, 5)

  const metrics = [
    {
      label: 'Products',
      value: productsReady ? String(products.length) : productsState === 'loading' ? '…' : '—',
      sub: productsReady
        ? `${bestsellerCount} bestseller${bestsellerCount === 1 ? '' : 's'}`
        : productsState === 'loading' ? 'loading' : 'load failed',
    },
    {
      label: 'Orders',
      value: ordersReady ? String(orders.length) : ordersState === 'loading' ? '…' : '—',
      sub: ordersReady ? `${paidOrders} paid` : ordersState === 'loading' ? 'loading' : 'login required',
    },
    {
      label: 'Revenue',
      value: ordersReady ? `${currency}${formatMoney(totalRevenue)}` : ordersState === 'loading' ? '…' : '—',
      sub: ordersReady ? 'paid only' : ordersState === 'loading' ? 'loading' : 'login required',
    },
    {
      label: 'Bestsellers',
      value: productsReady ? String(bestsellerCount) : productsState === 'loading' ? '…' : '—',
      sub: productsReady ? 'flagged' : productsState === 'loading' ? 'loading' : 'load failed',
    },
  ]

  return (
    <div className='flex flex-col gap-8'>

      <div className='dash-enter flex flex-wrap items-end justify-between gap-4 border-b border-black pb-4'>
        <h1 className='text-3xl font-semibold tracking-tight text-black'>Dashboard</h1>
        <p className='text-sm text-gray-600'>{TODAY_LABEL}</p>
      </div>

      <section aria-label='Key metrics' className='card overflow-hidden'>
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 dash-stagger'>
          {metrics.map((metric) => (
            <div key={metric.label} className='bg-white px-5 sm:px-6 py-5 min-w-0'>
              <p className='text-xs font-medium uppercase tracking-wider text-gray-600'>{metric.label}</p>
              <p className='text-base sm:text-2xl xl:text-3xl font-semibold text-black mt-1.5 tabular-nums leading-tight'>{metric.value}</p>
              <p className='text-xs text-gray-600 mt-1'>{metric.sub}</p>
            </div>
          ))}
        </div>
      </section>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>

        <section aria-label='Products by category' className='card p-5 sm:p-6'>
          <div className='flex items-baseline justify-between mb-5'>
            <h2 className='font-semibold text-black'>Products by category</h2>
            <div className='flex items-baseline gap-3 shrink-0 whitespace-nowrap'>
              {productsReady && (
                <span className='text-xs text-gray-600 tabular-nums'>{products.length} total</span>
              )}
              <NavLink to='/list' className={viewAllLink}>View all</NavLink>
            </div>
          </div>
          {productsState === 'loading' ? (
            <p className='text-sm text-gray-600' role='status'>Loading products…</p>
          ) : productsState === 'error' ? (
            <div className='flex flex-col items-start gap-2'>
              <p className='text-sm text-black' role='alert'>Could not load products.</p>
              <button
                type='button'
                onClick={fetchProducts}
                className='text-sm font-medium text-black underline underline-offset-4 hover:text-gray-600'
              >
                Try again
              </button>
            </div>
          ) : products.length === 0 ? (
            <p className='text-sm text-gray-600'>No products yet. Add items to see stock by category.</p>
          ) : (
            <div className='flex flex-col gap-5'>
              {categoryStats.map((category) => (
                <div key={category.name}>
                  <div className='flex justify-between items-baseline mb-2'>
                    <span className='text-sm font-medium text-black'>{category.name}</span>
                    <span className='text-sm font-semibold text-black tabular-nums'>{category.count}</span>
                  </div>
                  <div
                    className='h-2 bg-gray-100 rounded-full overflow-hidden'
                    role='img'
                    aria-label={`${category.name}: ${category.count} products`}
                  >
                    <div
                      className='h-full bg-black rounded-full dashboard-bar'
                      style={{ width: `${(category.count / maxCategoryCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section aria-label='Recent orders' className='card p-5 sm:p-6'>
          <div className='flex items-baseline justify-between mb-5'>
            <h2 className='font-semibold text-black'>Recent orders</h2>
            <div className='flex items-baseline gap-3 shrink-0 whitespace-nowrap'>
              {ordersReady && recentOrders.length > 0 && (
                <span className='text-xs text-gray-600'>Latest 5</span>
              )}
              <NavLink to='/orders' className={viewAllLink}>View all</NavLink>
            </div>
          </div>
          {ordersState === 'logged-out' ? (
            <div className='flex flex-col items-start gap-2 py-4'>
              <p className='text-sm font-medium text-black'>Login to see orders</p>
              <p className='text-sm text-gray-600'>Order activity appears here after you log in.</p>
            </div>
          ) : ordersState === 'loading' ? (
            <p className='text-sm text-gray-600' role='status'>Loading orders…</p>
          ) : ordersState === 'error' ? (
            <div className='flex flex-col items-start gap-2'>
              <p className='text-sm text-black' role='alert'>Could not load orders{ordersError ? `: ${ordersError}` : '.'}</p>
              <button
                type='button'
                onClick={fetchOrders}
                className='text-sm font-medium text-black underline underline-offset-4 hover:text-gray-600'
              >
                Try again
              </button>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className='flex flex-col items-start gap-1 py-4'>
              <p className='text-sm font-medium text-black'>No orders yet</p>
              <p className='text-sm text-gray-600'>New orders will appear here.</p>
            </div>
          ) : (
            <ul className='flex flex-col dash-stagger'>
              {recentOrders.map((order) => (
                <li
                  className='flex flex-wrap items-center justify-between gap-x-3 gap-y-1 py-3 border-b border-gray-200 last:border-0 last:pb-0 first:pt-0'
                  key={order._id}
                >
                  <div className='flex items-center gap-3 min-w-0 grow'>
                    <div
                      className='w-8 h-8 rounded-full bg-black text-white text-[11px] font-semibold flex items-center justify-center shrink-0'
                      aria-hidden='true'
                    >
                      {(order.address.firstName?.[0] || '?').toUpperCase()}
                      {(order.address.lastName?.[0] || '').toUpperCase()}
                    </div>
                    <div className='min-w-0'>
                      <p className='text-sm font-medium text-black truncate'>
                        {order.address.firstName} {order.address.lastName}
                      </p>
                      <p className='text-xs text-gray-600'>
                        {new Date(order.date).toLocaleDateString()}
                        {!order.payment && <span> · unpaid</span>}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-3 shrink-0 ml-auto'>
                    <span className='text-sm font-semibold text-black tabular-nums whitespace-nowrap'>
                      {currency}{formatMoney(order.amount)}
                    </span>
                    <span
                      className={`text-[11px] uppercase tracking-wide px-2 py-0.5 rounded-full border font-medium whitespace-nowrap ${statusStyles[order.status] || statusStyles['Order Placed']}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

      </div>

    </div>
  )
}

export default Dashboard