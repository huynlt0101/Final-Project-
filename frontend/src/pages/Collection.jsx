import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {

  const { products, search, showSearch, loading } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relavent')

  const toggleCategory = (e) => {

    if (category.includes(e.target.value)) {
        setCategory(prev => prev.filter(item => item !== e.target.value))
    }
    else {
      setCategory(prev => [...prev, e.target.value])
    }

  }

  const toggleSubCategory = (e) => {

    if (subCategory.includes(e.target.value)) {
      setSubCategory(prev => prev.filter(item => item !== e.target.value))
    }
    else {
      setSubCategory(prev => [...prev, e.target.value])
    }
  }

  const applyFilter = () => {

    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category));
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory))
    }

    setFilterProducts(productsCopy)

  }

  const sortProduct = () => {

    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a, b) => (a.price - b.price)));
        break;

      case 'high-low':
        setFilterProducts(fpCopy.sort((a, b) => (b.price - a.price)));
        break;

      default:
        applyFilter();
        break;
    }

  }

  useEffect(() => {
      applyFilter();
  }, [category, subCategory, search, showSearch, products])

  useEffect(() => {
    sortProduct();
  }, [sortType])

  return (
    <div className='flex flex-col gap-10 pt-12 lg:flex-row lg:gap-14'>

      {/* Filter Options */}
      <aside className='lg:w-60 lg:shrink-0'>
        <button
          type='button'
          onClick={() => setShowFilter(!showFilter)}
          className='flex w-full items-center justify-between border-y border-line py-4 text-xs font-medium uppercase tracking-[0.18em] lg:hidden'
        >
          Filters
          <img className={`h-3 transition-transform duration-200 ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt='' />
        </button>

        <div className={`${showFilter ? 'block' : 'hidden'} lg:sticky lg:top-28 lg:block`}>
          <p className='hidden border-b border-line pb-4 text-xs font-medium uppercase tracking-[0.18em] lg:block'>Filters</p>

          <fieldset className='border-b border-line py-6'>
            <legend className='mb-4 text-xs font-medium uppercase tracking-[0.18em] text-muted'>Category</legend>
            <div className='flex flex-col gap-3 text-sm text-ink/80'>
              <label className='flex cursor-pointer items-center gap-3'>
                <input className='h-4 w-4 accent-ink' type="checkbox" value={'Men'} onChange={toggleCategory} /> Men
              </label>
              <label className='flex cursor-pointer items-center gap-3'>
                <input className='h-4 w-4 accent-ink' type="checkbox" value={'Women'} onChange={toggleCategory} /> Women
              </label>
              <label className='flex cursor-pointer items-center gap-3'>
                <input className='h-4 w-4 accent-ink' type="checkbox" value={'Kids'} onChange={toggleCategory} /> Kids
              </label>
            </div>
          </fieldset>

          <fieldset className='py-6'>
            <legend className='mb-4 text-xs font-medium uppercase tracking-[0.18em] text-muted'>Type</legend>
            <div className='flex flex-col gap-3 text-sm text-ink/80'>
              <label className='flex cursor-pointer items-center gap-3'>
                <input className='h-4 w-4 accent-ink' type="checkbox" value={'Topwear'} onChange={toggleSubCategory} /> Topwear
              </label>
              <label className='flex cursor-pointer items-center gap-3'>
                <input className='h-4 w-4 accent-ink' type="checkbox" value={'Bottomwear'} onChange={toggleSubCategory} /> Bottomwear
              </label>
              <label className='flex cursor-pointer items-center gap-3'>
                <input className='h-4 w-4 accent-ink' type="checkbox" value={'Winterwear'} onChange={toggleSubCategory} /> Winterwear
              </label>
            </div>
          </fieldset>
        </div>
      </aside>

      {/* Right Side */}
      <div className='flex-1'>

        <div className='flex flex-col gap-5 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between'>
            <div>
              <Title text1='All' text2='Collections' />
              <p className='mt-3 text-sm text-muted'>
                {loading ? 'Loading the collection…' : `${filterProducts.length} ${filterProducts.length === 1 ? 'piece' : 'pieces'}`}
              </p>
            </div>
            <label className='flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-muted'>
              Sort
              <select
                onChange={(e) => setSortType(e.target.value)}
                className='border border-line bg-paper px-3 py-2 text-xs uppercase tracking-[0.14em] text-ink transition-colors focus:border-ink focus:outline-none'
              >
                <option value="relavent">Relevant</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
            </label>
        </div>

        {loading ? (
          <div className='mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4'>
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className='animate-pulse'>
                <div className='aspect-[3/4] bg-surface' />
                <div className='mt-3 h-3 w-3/4 bg-surface' />
                <div className='mt-2 h-3 w-1/3 bg-surface' />
              </div>
            ))}
          </div>
        ) : filterProducts.length === 0 ? (
          <div className='py-24 text-center'>
            <p className='display text-2xl'>Nothing matches yet</p>
            <p className='mt-3 text-sm text-muted'>Try removing a filter or searching for something else.</p>
          </div>
        ) : (
          <div className='mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4'>
            {
              filterProducts.map((item, index) => (
                <ProductItem key={index} name={item.name} id={item._id} price={item.price} image={item.image} />
              ))
            }
          </div>
        )}
      </div>

    </div>
  )
}

export default Collection
