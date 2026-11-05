import React from 'react'

const Navbar = ({ setToken }) => {
  return (
    <header className='sticky top-0 z-40 bg-white border-b border-gray-200'>
      <div className='flex items-center justify-between h-14 px-4 sm:px-6'>
        <div className='flex items-center gap-2.5 min-w-0'>
          <span
            className='w-7 h-7 bg-black text-white text-xs font-semibold flex items-center justify-center rounded shrink-0'
            aria-hidden='true'
          >
            F
          </span>
          <span className='font-semibold tracking-tight text-black truncate'>Foxie Shop</span>
          <span className='hidden sm:inline text-xs text-gray-500 border-l border-gray-300 pl-2.5'>
            Admin
          </span>
        </div>
        <button
          type='button'
          onClick={() => setToken('')}
          className='shrink-0 text-sm font-medium px-4 py-1.5 rounded-full border border-gray-300 text-black hover:border-black hover:bg-black hover:text-white transition-colors duration-150'
        >
          Logout
        </button>
      </div>
    </header>
  )
}

export default Navbar
