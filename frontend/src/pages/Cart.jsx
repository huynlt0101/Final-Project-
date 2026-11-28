import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext, formatVND } from '../context/ShopContext'
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';

const Cart = () => {

  const { products, token, cartItems, updateQuantity, navigate } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

  useEffect(() => {

    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item]
            })
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products])

  return (
    <div className='pt-12'>

      <Title text1='Your' text2='Cart' />

      {cartData.length === 0 ? (
        <div className='mt-14 border-y border-line py-20 text-center'>
          <p className='display text-2xl'>Your cart is empty</p>
          <p className='mx-auto mt-3 max-w-[40ch] text-sm leading-relaxed text-muted'>
            Browse the collection and add a few pieces to get started.
          </p>
          <Link to='/collection' className='btn-outline mt-8'>Shop the collection</Link>
        </div>
      ) : (
        <div className='mt-8 grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:items-start'>

          <div className='divide-y divide-line border-y border-line'>
            {
              cartData.map((item, index) => {

                const productData = products.find((product) => product._id === item._id);

                if (!productData) return null

                return (
                  <div key={index} className='flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='flex items-start gap-5'>
                      <Link to={`/product/${item._id}`} className='w-20 shrink-0 bg-surface'>
                        <img className='aspect-[3/4] w-full object-cover' src={productData.image[0]} alt={productData.name} />
                      </Link>
                      <div className='flex flex-col gap-2'>
                        <Link to={`/product/${item._id}`} className='text-sm font-medium text-ink transition-opacity hover:opacity-70'>{productData.name}</Link>
                        <p className='text-sm tabular-nums text-muted'>{formatVND(productData.price)}</p>
                        <p className='text-xs uppercase tracking-[0.16em] text-muted'>Size {item.size}</p>
                      </div>
                    </div>

                    <div className='flex items-center justify-between gap-6 sm:justify-end'>
                      <div className='flex items-center border border-line'>
                        <button type='button' onClick={() => updateQuantity(item._id, item.size, Math.max(1, item.quantity - 1))} aria-label='Decrease quantity' className='h-9 w-9 text-sm transition-colors hover:bg-surface'>−</button>
                        <span className='w-8 text-center text-sm tabular-nums'>{item.quantity}</span>
                        <button type='button' onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)} aria-label='Increase quantity' className='h-9 w-9 text-sm transition-colors hover:bg-surface'>+</button>
                      </div>
                      <button type='button' onClick={() => updateQuantity(item._id, item.size, 0)} aria-label={`Remove ${productData.name}`} className='p-1 opacity-60 transition-opacity hover:opacity-100'>
                        <img className='h-4 w-4' src={assets.bin_icon} alt='' />
                      </button>
                    </div>
                  </div>
                )

              })
            }
          </div>

          <div className='lg:sticky lg:top-28'>
            <CartTotal />
            <button onClick={() => token ? navigate('/place-order') : navigate('/login', { state: { from: '/place-order' } })} className='btn-primary mt-5 w-full'>Proceed to checkout</button>
          </div>

        </div>
      )}

    </div>
  )
}

export default Cart
