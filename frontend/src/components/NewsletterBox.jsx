const NewsletterBox = () => {

    const onSubmitHandler = (event) => {
        event.preventDefault();
    }

  return (
    <div className='border border-line px-6 py-14 text-center sm:px-12'>
      <h2 className='display text-[clamp(1.6rem,3vw,2.4rem)] leading-tight text-ink'>Join the studio list</h2>
      <p className='mx-auto mt-4 max-w-[46ch] text-sm leading-relaxed text-muted'>
        New arrivals, restocks, and notes from the studio — sent occasionally, never often.
      </p>
      <form onSubmit={onSubmitHandler} className='mx-auto mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:gap-0'>
        <label htmlFor='newsletter-email' className='sr-only'>Email address</label>
        <input
          id='newsletter-email'
          className='field sm:border-r-0'
          type='email'
          placeholder='Your email address'
          required
        />
        <button type='submit' className='btn-primary shrink-0'>Subscribe</button>
      </form>
    </div>
  )
}

export default NewsletterBox
