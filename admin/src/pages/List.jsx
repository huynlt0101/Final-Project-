import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

const List = ({ token }) => {

  const [list, setList] = useState([])
  const [state, setState] = useState('loading')

  const fetchList = async () => {
    setState('loading')
    try {
      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setList(response.data.products.reverse())
        setState('ready')
      } else {
        toast.error(response.data.message)
        setState('error')
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
      setState('error')
    }
  }

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <div className='flex flex-col gap-6'>
      <div className='border-b border-black pb-4'>
        <h1 className='text-2xl font-semibold tracking-tight text-black'>Products</h1>
        <p className='text-sm text-gray-600 mt-1'>
          {state === 'ready' ? `${list.length} item${list.length === 1 ? '' : 's'} in catalog` : 'Catalog overview'}
        </p>
      </div>

      <div className='flex flex-col gap-2'>
        <div className='hidden md:grid grid-cols-[5rem_1fr_8rem_6rem_5rem] items-center gap-3 py-2.5 px-4 bg-black text-white text-xs uppercase tracking-wider font-medium rounded-t-lg'>
          <span>Image</span>
          <span>Name</span>
          <span>Category</span>
          <span className='text-right'>Price</span>
          <span className='text-center'>Action</span>
        </div>

        {state === 'loading' ? (
          <div className='border border-gray-200 rounded-b-lg md:rounded-t-none py-12 text-center text-sm text-gray-600' role='status'>
            Loading products…
          </div>
        ) : state === 'error' ? (
          <div className='border border-gray-200 rounded-lg py-12 text-center'>
            <p className='text-sm text-black font-medium' role='alert'>Could not load products</p>
            <button
              type='button'
              onClick={fetchList}
              className='mt-2 text-sm font-medium text-black underline underline-offset-4 hover:text-gray-600'
            >
              Try again
            </button>
          </div>
        ) : list.length === 0 ? (
          <div className='border border-gray-200 rounded-lg py-12 text-center'>
            <p className='text-sm font-medium text-black'>No products yet</p>
            <p className='text-sm text-gray-600 mt-1'>Add items to build your catalog.</p>
          </div>
        ) : (
          list.map((item, index) => (
            <div
              className='grid grid-cols-[4rem_1fr_4rem] md:grid-cols-[5rem_1fr_8rem_6rem_5rem] items-center gap-3 py-3 px-4 border border-gray-200 border-t-0 text-sm first:rounded-t-none last:rounded-b-lg first:border-t md:first:border-t [&:not(:first-child)]:rounded-none'
              key={item._id || index}
            >
              <img
                className='w-12 h-12 object-cover rounded-md border border-gray-200 bg-gray-50'
                src={item.image[0]}
                alt={item.name}
              />
              <div className='min-w-0'>
                <p className='font-medium text-black truncate'>{item.name}</p>
                <p className='text-xs text-gray-600 md:hidden'>{item.category} · {currency}{item.price}</p>
              </div>
              <p className='hidden md:block text-gray-700'>{item.category}</p>
              <p className='hidden md:block text-right font-semibold text-black tabular-nums'>{currency}{item.price}</p>
              <button
                type='button'
                onClick={() => removeProduct(item._id)}
                className='justify-self-center w-8 h-8 rounded-full border border-gray-300 text-gray-600 text-xs font-semibold hover:border-black hover:bg-black hover:text-white transition-colors duration-150'
                aria-label={`Remove ${item.name}`}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default List
