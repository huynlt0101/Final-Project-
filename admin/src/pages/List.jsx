import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, formatVND } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import Add from './Add'

const List = ({ token }) => {

  const [list, setList] = useState([])
  const [editingProduct, setEditingProduct] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const openAdd = () => {
    setEditingProduct(null)
    setShowForm(true)
  }

  const openEdit = (item) => {
    setEditingProduct(item)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingProduct(null)
  }

  const fetchList = async () => {
    try {

      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setList(response.data.products.reverse());
      }
      else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const removeProduct = async (id) => {
    try {

      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } })

      if (response.data.success) {
        toast.success(response.data.message)
        if (editingProduct && editingProduct._id === id) {
          closeForm()
        }
        await fetchList();
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
    <>
      <div className='mb-4'>
        <button onClick={openAdd} className='px-4 py-2 bg-black text-white text-sm'>+ Add Product</button>
      </div>

      <p className='mb-2'>All Products List</p>
      <div className='flex flex-col gap-2'>

        {/* ------- List Table Title ---------- */}

        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
        </div>

        {/* ------ Product List ------ */}

        {
          list.map((item, index) => (
            <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm' key={index}>
              <img className='w-12' src={item.image[0]} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{formatVND(item.price)}</p>
              <div className='flex justify-center items-center gap-3'>
                <img onClick={()=>openEdit(item)} src={assets.edit_icon} className='w-5 h-5 cursor-pointer' title='Edit' alt='Edit' />
                <p onClick={()=>removeProduct(item._id)} className='w-5 h-5 flex items-center justify-center text-sm font-bold cursor-pointer' title='Remove'>X</p>
              </div>
            </div>
          ))
        }

      </div>

      {/* ------- Add / Edit Modal ------- */}
      {showForm && (
        <div
          onClick={closeForm}
          className='fixed inset-0 bg-black/50 z-50 flex justify-center items-start overflow-y-auto'
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className='bg-white p-6 rounded-md w-full max-w-[600px] my-10 mx-4'
          >
            <Add
              token={token}
              editingProduct={editingProduct}
              onDone={() => { closeForm(); fetchList() }}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default List
