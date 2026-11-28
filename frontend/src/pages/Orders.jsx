import { Fragment, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext, formatVND } from '../context/ShopContext'
import Title from '../components/Title';
import axios from 'axios';

const steps = ['Order Placed', 'Packing', 'Shipped', 'Delivered']

const Orders = () => {

  const { backendUrl, token } = useContext(ShopContext);

  const [orderData, setorderData] = useState([])
  const [loading, setLoading] = useState(true)

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null
      }

      setLoading(true)
      const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } })
      if (response.data.success) {
        let allOrdersItem = []
        response.data.orders.map((order) => {
          if (order.items.length === 0) {
            allOrdersItem.push({
              name: '(Empty order)',
              quantity: 0,
              size: '-',
              price: 0,
              image: [],
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date
            })
            return
          }
          order.items.map((item) => {
            item['status'] = order.status
            item['payment'] = order.payment
            item['paymentMethod'] = order.paymentMethod
            item['date'] = order.date
            allOrdersItem.push(item)
          })
        })
        setorderData(allOrdersItem.reverse())
      }

    } catch (error) {
        void error;
    } finally {
        setLoading(false)
    }
  }

  useEffect(() => {
    loadOrderData()
  }, [token])

  return (
    <div className='pt-12'>

        <Title text1='My' text2='Orders' />

        {!token ? (
          <div className='mt-14 border-y border-line py-20 text-center'>
            <p className='display text-2xl'>Sign in to see your orders</p>
            <p className='mx-auto mt-3 max-w-[42ch] text-sm leading-relaxed text-muted'>
              Your order history and live status are tied to your account.
            </p>
            <Link to='/login' state={{ from: '/orders' }} className='btn-outline mt-8'>Sign in</Link>
          </div>
        ) : loading ? (
          <div className='flex justify-center py-24'>
            <span className='h-8 w-8 animate-spin rounded-full border-2 border-line border-t-ink' aria-hidden='true' />
          </div>
        ) : orderData.length === 0 ? (
          <div className='mt-14 border-y border-line py-20 text-center'>
            <p className='display text-2xl'>No orders yet</p>
            <p className='mx-auto mt-3 max-w-[42ch] text-sm leading-relaxed text-muted'>
              When you place an order, you will be able to follow its progress here.
            </p>
            <Link to='/collection' className='btn-outline mt-8'>Start shopping</Link>
          </div>
        ) : (
          <div className='mt-8 divide-y divide-line border-y border-line'>
            {
              orderData.map((item, index) => {
                const stepIndex = steps.indexOf(item.status)
                return (
                  <div key={index} className='flex flex-col gap-6 py-6 md:flex-row md:items-center md:justify-between'>
                    <div className='flex items-start gap-5'>
                        {item.image && item.image[0] && <img className='aspect-[3/4] w-16 shrink-0 bg-surface object-cover' src={item.image[0]} alt='' />}
                        <div className='flex flex-col gap-1.5 text-sm'>
                          <p className='font-medium text-ink'>{item.name}</p>
                          <p className='tabular-nums text-muted'>{formatVND(item.price)}</p>
                          <p className='text-xs uppercase tracking-[0.14em] text-muted'>Qty {item.quantity} · Size {item.size}</p>
                          <p className='text-xs text-muted'>Ordered {new Date(item.date).toDateString()}</p>
                          <p className='text-xs text-muted'>Payment: {item.paymentMethod}{item.payment ? ' · Paid' : ''}</p>
                        </div>
                    </div>

                    <div className='flex flex-col gap-4 md:items-end'>
                        <div className='flex items-center' aria-hidden='true'>
                          {steps.map((step, i) => (
                            <Fragment key={step}>
                              <span className={`h-1.5 w-1.5 rounded-full ${i <= stepIndex ? 'bg-ink' : 'bg-line'}`} />
                              {i < steps.length - 1 && <span className={`h-px w-6 ${i < stepIndex ? 'bg-ink' : 'bg-line'}`} />}
                            </Fragment>
                          ))}
                        </div>
                        <p className='text-sm font-medium text-ink'>{item.status}</p>
                        <button onClick={loadOrderData} className='btn-outline w-fit px-6 py-2.5 text-[10px]'>Refresh status</button>
                    </div>
                  </div>
                )
              })
            }
          </div>
        )}
    </div>
  )
}

export default Orders
