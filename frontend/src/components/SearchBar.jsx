import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {

  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
  const [visible, setVisible] = useState(false)
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes('collection')) {
      setVisible(true);
    }
    else {
      setVisible(false)
    }
  }, [location])

  return showSearch && visible ? (
    <div className='bg-surface'>
      <div className='flex items-center gap-3 py-3'>
        <img className='h-4 w-4 opacity-60' src={assets.search_icon} alt='' />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted'
          type="text"
          placeholder='Search the collection'
          aria-label='Search the collection'
        />
        <button type='button' onClick={() => setShowSearch(false)} aria-label='Close search' className='p-1 transition-opacity hover:opacity-60'>
          <img className='h-3 w-3' src={assets.cross_icon} alt='' />
        </button>
      </div>
    </div>
  ) : null
}

export default SearchBar
