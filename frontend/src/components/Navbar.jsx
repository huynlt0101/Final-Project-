import { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';

const navLinkClass = ({ isActive }) =>
  `group relative py-1 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors ${
    isActive ? 'text-ink' : 'text-muted hover:text-ink'
  }`

const Navbar = () => {

  const [visible, setVisible] = useState(false);

  const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext);

  const cartCount = getCartCount();

  const logout = () => {
    navigate('/login')
    localStorage.removeItem('token')
    setToken('')
    setCartItems({})
  }

  useEffect(() => {
    if (!visible) return
    const onKey = (event) => {
      if (event.key === 'Escape') setVisible(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [visible])

  return (
    <nav className='flex items-center justify-between py-4'>

      <Link to='/' aria-label='Foxie Shop home' className='group flex items-baseline gap-1.5'>
        <span className='display text-2xl leading-none tracking-tightest'>Foxie</span>
        <span className='text-[10px] font-medium uppercase tracking-[0.28em] text-muted'>Shop</span>
      </Link>

      <ul className='hidden items-center gap-8 sm:flex'>
        <NavLink to='/' className={navLinkClass}>
          {({ isActive }) => (
            <span className='relative'>
              Home
              <span className={`absolute -bottom-1 left-0 h-px w-full origin-left bg-ink transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
            </span>
          )}
        </NavLink>
        <NavLink to='/collection' className={navLinkClass}>
          {({ isActive }) => (
            <span className='relative'>
              Collection
              <span className={`absolute -bottom-1 left-0 h-px w-full origin-left bg-ink transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
            </span>
          )}
        </NavLink>
        <NavLink to='/about' className={navLinkClass}>
          {({ isActive }) => (
            <span className='relative'>
              About
              <span className={`absolute -bottom-1 left-0 h-px w-full origin-left bg-ink transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
            </span>
          )}
        </NavLink>
        <NavLink to='/contact' className={navLinkClass}>
          {({ isActive }) => (
            <span className='relative'>
              Contact
              <span className={`absolute -bottom-1 left-0 h-px w-full origin-left bg-ink transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
            </span>
          )}
        </NavLink>
      </ul>

      <div className='flex items-center gap-5 sm:gap-6'>
        <button
          type='button'
          aria-label='Search products'
          onClick={() => { setShowSearch(true); navigate('/collection') }}
          className='transition-opacity duration-200 hover:opacity-60'
        >
          <img src={assets.search_icon} className='w-5' alt='' />
        </button>

        <div className='group relative'>
          <button
            type='button'
            aria-label={token ? 'Account menu' : 'Sign in'}
            aria-haspopup='true'
            onClick={() => { if (!token) navigate('/login') }}
            className='flex transition-opacity duration-200 hover:opacity-60'
          >
            <img className='w-5' src={assets.profile_icon} alt='' />
          </button>
          {token &&
            <div className='invisible absolute right-0 top-full z-50 w-44 pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100'>
              <div className='flex flex-col border border-line bg-paper py-2 text-sm shadow-[0_12px_40px_-16px_rgba(10,10,10,0.35)]'>
                <button type='button' onClick={() => navigate('/orders')} className='cursor-pointer px-4 py-2 text-left text-muted transition-colors hover:text-ink'>Orders</button>
                <button type='button' onClick={logout} className='cursor-pointer px-4 py-2 text-left text-muted transition-colors hover:text-ink'>Logout</button>
              </div>
            </div>}
        </div>

        <Link to='/cart' className='relative transition-opacity duration-200 hover:opacity-60' aria-label={`Cart, ${cartCount} items`}>
          <img src={assets.cart_icon} className='w-5 min-w-5' alt='' />
          {cartCount > 0 &&
            <span className='absolute -bottom-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[9px] font-medium leading-none text-paper tabular-nums'>
              {cartCount}
            </span>}
        </Link>

        <button type='button' aria-label='Open menu' onClick={() => setVisible(true)} className='transition-opacity duration-200 hover:opacity-60 sm:hidden'>
          <img src={assets.menu_icon} className='w-5' alt='' />
        </button>
      </div>

      <div className={`fixed inset-0 z-50 sm:hidden ${visible ? 'visible' : 'invisible pointer-events-none'}`} aria-hidden={!visible}>
        <div
          onClick={() => setVisible(false)}
          className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
        />
        <div className={`absolute inset-y-0 right-0 flex w-[82%] max-w-sm flex-col bg-paper transition-transform duration-300 ease-out-expo ${visible ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className='flex items-center justify-between border-b border-line px-6 py-5'>
            <span className='display text-xl'>Menu</span>
            <button type='button' aria-label='Close menu' onClick={() => setVisible(false)} className='p-1 transition-opacity hover:opacity-60'>
              <img className='h-4 w-4' src={assets.cross_icon} alt='' />
            </button>
          </div>
          <div className='flex flex-col px-6 py-2'>
            <NavLink onClick={() => setVisible(false)} className='border-b border-line py-4 text-xs font-medium uppercase tracking-[0.18em] text-ink' to='/'>Home</NavLink>
            <NavLink onClick={() => setVisible(false)} className='border-b border-line py-4 text-xs font-medium uppercase tracking-[0.18em] text-ink' to='/collection'>Collection</NavLink>
            <NavLink onClick={() => setVisible(false)} className='border-b border-line py-4 text-xs font-medium uppercase tracking-[0.18em] text-ink' to='/about'>About</NavLink>
            <NavLink onClick={() => setVisible(false)} className='border-b border-line py-4 text-xs font-medium uppercase tracking-[0.18em] text-ink' to='/contact'>Contact</NavLink>
            <NavLink onClick={() => setVisible(false)} className='border-b border-line py-4 text-xs font-medium uppercase tracking-[0.18em] text-ink' to='/cart'>Cart</NavLink>
          </div>
          <div className='mt-auto border-t border-line px-6 py-6'>
            {token ? (
              <div className='flex flex-col gap-4'>
                <button type='button' onClick={() => { setVisible(false); navigate('/orders') }} className='text-left text-xs font-medium uppercase tracking-[0.18em] text-ink'>My orders</button>
                <button type='button' onClick={() => { setVisible(false); logout() }} className='text-left text-xs font-medium uppercase tracking-[0.18em] text-ink'>Logout</button>
              </div>
            ) : (
              <button type='button' onClick={() => { setVisible(false); navigate('/login') }} className='text-left text-xs font-medium uppercase tracking-[0.18em] text-ink'>Sign in</button>
            )}
          </div>
        </div>
      </div>

    </nav>
  )
}

export default Navbar
