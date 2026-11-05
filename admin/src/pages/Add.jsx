import React, { useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL']

const Add = ({ token }) => {

  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Men')
  const [subCategory, setSubCategory] = useState('Topwear')
  const [bestseller, setBestseller] = useState(false)
  const [sizes, setSizes] = useState([])
  const [submitting, setSubmitting] = useState(false)

  const toggleSize = (size) => {
    setSizes((prev) => prev.includes(size) ? prev.filter((item) => item !== size) : [...prev, size])
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (sizes.length === 0) {
      toast.error('Select at least one size')
      return
    }
    setSubmitting(true)
    try {
      const formData = new FormData()

      formData.append('name', name)
      formData.append('description', description)
      formData.append('price', price)
      formData.append('category', category)
      formData.append('subCategory', subCategory)
      formData.append('bestseller', bestseller)
      formData.append('sizes', JSON.stringify(sizes))

      if (image1) formData.append('image1', image1)
      if (image2) formData.append('image2', image2)
      if (image3) formData.append('image3', image3)
      if (image4) formData.append('image4', image4)

      const response = await axios.post(backendUrl + '/api/product/add', formData, { headers: { token } })

      if (response.data.success) {
        toast.success(response.data.message)
        setName('')
        setDescription('')
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setPrice('')
        setSizes([])
        setBestseller(false)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const imageSlots = [
    { id: 'image1', file: image1, set: setImage1 },
    { id: 'image2', file: image2, set: setImage2 },
    { id: 'image3', file: image3, set: setImage3 },
    { id: 'image4', file: image4, set: setImage4 },
  ]

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-6 max-w-2xl'>
      <div className='w-full border-b border-black pb-4'>
        <h1 className='text-2xl font-semibold tracking-tight text-black'>Add product</h1>
        <p className='text-sm text-gray-600 mt-1'>Create a new item for the catalog</p>
      </div>

      <section className='w-full' aria-label='Product images'>
        <h2 className='text-sm font-medium text-black mb-3'>Images</h2>
        <div className='flex flex-wrap gap-3'>
          {imageSlots.map((slot) => (
            <label
              key={slot.id}
              htmlFor={slot.id}
              className='w-20 h-20 border border-dashed border-gray-400 rounded-lg overflow-hidden cursor-pointer hover:border-black transition-colors block bg-gray-50'
            >
              <img
                className='w-full h-full object-cover'
                src={!slot.file ? assets.upload_area : URL.createObjectURL(slot.file)}
                alt={slot.file ? 'Selected product image' : 'Upload placeholder'}
              />
              <input
                onChange={(e) => slot.set(e.target.files[0])}
                type='file'
                id={slot.id}
                accept='image/*'
                hidden
              />
            </label>
          ))}
        </div>
      </section>

      <div className='w-full grid gap-5'>
        <div>
          <label htmlFor='product-name' className='block text-sm font-medium text-black mb-2'>Product name</label>
          <input
            id='product-name'
            onChange={(e) => setName(e.target.value)}
            value={name}
            className='w-full px-3 py-2 rounded-md'
            type='text'
            placeholder='e.g. Classic Cotton Tee'
            required
          />
        </div>

        <div>
          <label htmlFor='product-desc' className='block text-sm font-medium text-black mb-2'>Description</label>
          <textarea
            id='product-desc'
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className='w-full px-3 py-2 rounded-md min-h-24'
            placeholder='Fabric, fit, care details…'
            required
          />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          <div>
            <label htmlFor='product-category' className='block text-sm font-medium text-black mb-2'>Category</label>
            <select
              id='product-category'
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              className='w-full px-3 py-2 rounded-md'
            >
              <option value='Men'>Men</option>
              <option value='Women'>Women</option>
              <option value='Kids'>Kids</option>
            </select>
          </div>

          <div>
            <label htmlFor='product-subcategory' className='block text-sm font-medium text-black mb-2'>Sub category</label>
            <select
              id='product-subcategory'
              onChange={(e) => setSubCategory(e.target.value)}
              value={subCategory}
              className='w-full px-3 py-2 rounded-md'
            >
              <option value='Topwear'>Topwear</option>
              <option value='Bottomwear'>Bottomwear</option>
              <option value='Winterwear'>Winterwear</option>
            </select>
          </div>

          <div>
            <label htmlFor='product-price' className='block text-sm font-medium text-black mb-2'>Price (USD)</label>
            <input
              id='product-price'
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              className='w-full px-3 py-2 rounded-md'
              type='number'
              min='0'
              step='0.01'
              placeholder='25'
              required
            />
          </div>
        </div>

        <div>
          <fieldset>
            <legend className='text-sm font-medium text-black mb-3'>Sizes</legend>
            <div className='flex flex-wrap gap-2'>
              {sizeOptions.map((size) => {
                const selected = sizes.includes(size)
                return (
                  <button
                    type='button'
                    key={size}
                    onClick={() => toggleSize(size)}
                    aria-pressed={selected}
                    className={`min-w-11 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors duration-150 ${
                      selected
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-black hover:text-black'
                    }`}
                  >
                    {size}
                  </button>
                )
              })}
            </div>
          </fieldset>
        </div>

        <label className='flex items-center gap-2.5 cursor-pointer w-fit'>
          <input
            onChange={() => setBestseller((prev) => !prev)}
            checked={bestseller}
            type='checkbox'
            id='bestseller'
            className='w-4 h-4 accent-black'
          />
          <span className='text-sm text-black'>Add to bestsellers</span>
        </label>

        <button
          type='submit'
          disabled={submitting}
          className='w-40 py-3 bg-black text-white text-sm font-semibold rounded-full hover:bg-gray-800 disabled:opacity-50 transition-colors duration-150 mt-2'
        >
          {submitting ? 'Adding…' : 'Add product'}
        </button>
      </div>
    </form>
  )
}

export default Add
