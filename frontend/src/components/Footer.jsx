import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='py-16 sm:py-20'>
      <div className='grid gap-12 sm:grid-cols-[1.6fr_1fr_1fr] sm:gap-10'>

        <div>
          <Link to='/' className='inline-flex items-baseline gap-2' aria-label='Foxie Shop home'>
            <span className='display text-3xl leading-none tracking-tightest'>Foxie</span>
            <span className='text-[11px] font-medium uppercase tracking-[0.28em] text-muted'>Shop</span>
          </Link>
          <p className='mt-5 max-w-[38ch] text-sm leading-relaxed text-muted'>
            Contemporary clothing for everyday wear. A considered edit of tops, outerwear, and easy layers — built around a simple, honest purchase flow.
          </p>
        </div>

        <div>
          <p className='text-[11px] font-medium uppercase tracking-[0.22em] text-muted'>Shop</p>
          <ul className='mt-5 flex flex-col gap-2.5 text-sm'>
            <li><Link to='/' className='text-ink/80 transition-colors hover:text-ink'>Home</Link></li>
            <li><Link to='/collection' className='text-ink/80 transition-colors hover:text-ink'>Collection</Link></li>
            <li><Link to='/about' className='text-ink/80 transition-colors hover:text-ink'>About</Link></li>
            <li><Link to='/contact' className='text-ink/80 transition-colors hover:text-ink'>Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className='text-[11px] font-medium uppercase tracking-[0.22em] text-muted'>Get in touch</p>
          <ul className='mt-5 flex flex-col gap-2.5 text-sm text-muted'>
            <li><a href='mailto:hello@foxieshop.vn' className='transition-colors hover:text-ink'>hello@foxieshop.vn</a></li>
            <li><a href='tel:+842812345678' className='transition-colors hover:text-ink'>+84 28 1234 5678</a></li>
            <li>Ho Chi Minh City, Vietnam</li>
          </ul>
        </div>

      </div>

      <div className='mt-14 flex flex-col gap-2 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between'>
        <p>© {new Date().getFullYear()} Foxie Shop. All rights reserved.</p>
        <p>Prices shown in VND.</p>
      </div>
    </div>
  )
}

export default Footer
