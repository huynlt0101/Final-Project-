import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'
import './Login.css'

const GoogleMark = () => (
    <svg aria-hidden="true" viewBox="0 0 48 48" className="auth-google-mark">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" transform="translate(0 5)" />
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.27 5.48-4.77 7.18l7.73 6C44.4 37.96 46.98 31.8 46.98 24.55Z" transform="translate(0 1)" />
        <path fill="#FBBC05" d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a23.98 23.98 0 0 0 0 21.56l7.98-6.19Z" transform="translate(0 5)" />
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.8l-7.73-6c-2.14 1.44-4.89 2.3-8.17 2.3-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" transform="translate(0 -5)" />
    </svg>
)

const BrandMark = () => (
    <svg aria-hidden="true" viewBox="0 0 32 32" fill="none">
        <path d="M16 3.5 19.2 12.8 28.5 16l-9.3 3.2L16 28.5l-3.2-9.3L3.5 16l9.3-3.2L16 3.5Z" fill="currentColor" />
        <circle cx="16" cy="16" r="3.1" fill="white" />
    </svg>
)

const AppleMark = () => (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.37 12.16c.02 2.24 1.97 2.99 2 3-.02.05-.31 1.08-1.03 2.14-.62.92-1.27 1.83-2.29 1.85-1 .02-1.32-.6-2.46-.6s-1.5.58-2.44.62c-.98.04-1.72-.99-2.35-1.9-1.28-1.85-2.26-5.23-.94-7.5a3.65 3.65 0 0 1 3.08-1.87c.97-.02 1.9.66 2.5.66.59 0 1.72-.81 2.9-.69.5.02 1.92.2 2.83 1.53-.07.04-1.69.99-1.68 2.76ZM14.47 6.63a3.58 3.58 0 0 0 .82-2.57 3.67 3.67 0 0 0-2.36 1.2 3.35 3.35 0 0 0-.85 2.48 3.03 3.03 0 0 0 2.39-1.11Z" />
    </svg>
)

const GithubMark = () => (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M12 .75a11.25 11.25 0 0 0-3.56 21.92c.56.1.77-.24.77-.54v-2.1c-3.13.68-3.79-1.33-3.79-1.33-.51-1.3-1.25-1.64-1.25-1.64-1.02-.7.08-.69.08-.69 1.12.08 1.72 1.16 1.72 1.16 1 1.71 2.62 1.22 3.26.93.1-.72.4-1.22.71-1.5-2.5-.28-5.13-1.25-5.13-5.56 0-1.23.44-2.24 1.16-3.03-.12-.28-.5-1.44.11-2.99 0 0 .95-.3 3.1 1.16a10.77 10.77 0 0 1 5.64 0c2.15-1.46 3.09-1.16 3.09-1.16.62 1.55.23 2.71.12 2.99.72.79 1.15 1.8 1.15 3.03 0 4.32-2.64 5.28-5.15 5.56.4.34.76 1.03.76 2.08v3.09c0 .3.2.65.77.54A11.25 11.25 0 0 0 12 .75Z" clipRule="evenodd" />
    </svg>
)

const MicrosoftMark = () => (
    <svg aria-hidden="true" viewBox="0 0 24 24">
        <path fill="#f25022" d="M2 2h9v9H2z" />
        <path fill="#7fba00" d="M13 2h9v9h-9z" />
        <path fill="#00a4ef" d="M2 13h9v9H2z" />
        <path fill="#ffb900" d="M13 13h9v9h-9z" />
    </svg>
)

const MailMark = () => (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="m4 7 8 6 8-6" />
    </svg>
)

const AlertMark = () => (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="10" r="8" />
        <path d="M10 6v4m0 3h.01" />
    </svg>
)

const SuccessMark = () => (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path className="auth-check-path" d="m4 10 4 4 8-8" />
    </svg>
)

const getAuthErrorMessage = (error) => {
    const messages = {
        'auth/email-already-in-use': 'An account already exists with this email. Try signing in instead.',
        'auth/invalid-credential': 'That email or password is incorrect.',
        'auth/invalid-email': 'Enter a valid email address.',
        'auth/operation-not-allowed': 'This sign-in method is not enabled in Firebase yet.',
        'auth/popup-blocked': 'Your browser blocked the Google sign-in popup.',
        'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
        'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
        'auth/weak-password': 'Choose a password with at least 6 characters.',
        'auth/user-disabled': 'This account has been disabled.',
        'auth/user-not-found': 'No account found with this email. You can sign up instead.',
        'auth/wrong-password': 'That email or password is incorrect.',
    }

    return messages[error.code] || error.message || 'Sign-in failed. Please try again.'
}

const Login = () => {
    const [emailMode, setEmailMode] = useState(false)
    const [isSignUp, setIsSignUp] = useState(false)
    const [authState, setAuthState] = useState('idle')
    const [notice, setNotice] = useState('')
    const pageRef = useRef(null)
    const timerRef = useRef(null)
    const navigate = useNavigate()

    useEffect(() => {
        const page = pageRef.current
        const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
        if (!page || motionPreference.matches) return undefined

        const handlePointerMove = (event) => {
            page.style.setProperty('--parallax-x', `${(event.clientX / window.innerWidth - 0.5) * 10}px`)
            page.style.setProperty('--parallax-y', `${(event.clientY / window.innerHeight - 0.5) * 10}px`)
        }

        window.addEventListener('pointermove', handlePointerMove, { passive: true })
        return () => window.removeEventListener('pointermove', handlePointerMove)
    }, [])

    useEffect(() => () => window.clearTimeout(timerRef.current), [])

    const startAuthentication = async (method, credentials = {}) => {
        window.clearTimeout(timerRef.current)
        setNotice('')
        setAuthState('loading')

        try {
            if (!['Google', 'Email', 'Sign up'].includes(method)) {
                throw new Error(`${method} sign-in is not configured yet.`)
            }
            if (!auth) {
                throw new Error('Add your Firebase settings to .env.local to enable sign-in.')
            }

            if (method === 'Google') {
                await signInWithPopup(auth, googleProvider)
            } else if (method === 'Sign up') {
                const { user } = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password)
                if (credentials.name) await updateProfile(user, { displayName: credentials.name })
            } else {
                await signInWithEmailAndPassword(auth, credentials.email, credentials.password)
            }

            setAuthState('success')
            setNotice('Successfully signed in. Redirecting...')
            timerRef.current = window.setTimeout(() => navigate('/'), 900)
        } catch (error) {
            setAuthState('error')
            setNotice(getAuthErrorMessage(error))
        }
    }

    const handleEmailSubmit = (event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        startAuthentication(isSignUp ? 'Sign up' : 'Email', {
            email: formData.get('email'),
            password: formData.get('password'),
            name: formData.get('name'),
        })
    }

    const openEmail = () => {
        setEmailMode(true)
        setAuthState('idle')
        setNotice('')
    }

    return (
        <main className="auth-page" ref={pageRef}>
            <div className="auth-backdrop" aria-hidden="true">
                <span className="auth-orb auth-orb--one" />
                <span className="auth-orb auth-orb--two" />
                <span className="auth-orb auth-orb--three" />
                <span className="auth-orb auth-orb--four" />
                <span className="auth-grain" />
                <span className="auth-particle auth-particle--one" />
                <span className="auth-particle auth-particle--two" />
                <span className="auth-particle auth-particle--three" />
                <span className="auth-particle auth-particle--four" />
                <span className="auth-particle auth-particle--five" />
            </div>

            <section className={`auth-card${authState === 'error' ? ' is-shaking' : ''}`} aria-labelledby="auth-title">
                <div className="auth-brand-mark"><BrandMark /></div>
                <p className="auth-brand-name">ASTER</p>
                <h1 id="auth-title">{emailMode && isSignUp ? 'Create your account' : 'Welcome back'}</h1>
                <p className="auth-subtitle">{emailMode && isSignUp ? 'Create an account to get started' : 'Sign in to continue to your account'}</p>

                {notice && (
                    <div className={authState === 'success' ? 'auth-success' : 'auth-error'} role={authState === 'success' ? 'status' : 'alert'} key={notice}>
                        {authState === 'success' ? <SuccessMark /> : <AlertMark />}
                        <span>{notice}</span>
                    </div>
                )}

                {emailMode ? (
                    <form className="auth-email-form" onSubmit={handleEmailSubmit}>
                        {isSignUp && <label className="auth-field"><span>Name</span><input autoComplete="name" name="name" placeholder="Your name" required /></label>}
                        <label className="auth-field"><span>Email address</span><input autoComplete="email" name="email" type="email" placeholder="you@example.com" required /></label>
                        <label className="auth-field"><span>Password</span><input autoComplete={isSignUp ? 'new-password' : 'current-password'} name="password" type="password" placeholder="At least 8 characters" minLength="8" required /></label>
                        <button className={`auth-button auth-button--email${authState === 'loading' ? ' is-loading' : ''}${authState === 'success' ? ' is-success' : ''}`} type="submit" disabled={authState === 'loading' || authState === 'success'}>
                            {authState === 'loading' ? <span className="auth-spinner" aria-hidden="true" /> : authState === 'success' ? <SuccessMark /> : <MailMark />}
                            <span>{authState === 'loading' ? 'Signing you in...' : authState === 'success' ? 'Successfully signed in' : isSignUp ? 'Create account' : 'Continue with email'}</span>
                        </button>
                    </form>
                ) : (
                    <>
                        <button
                            className={`auth-button auth-button--google${authState === 'loading' ? ' is-loading' : ''}${authState === 'success' ? ' is-success' : ''}`}
                            type="button"
                            onClick={() => startAuthentication('Google')}
                            disabled={authState === 'loading' || authState === 'success'}
                        >
                            {authState === 'loading' ? <span className="auth-spinner" aria-hidden="true" /> : authState === 'success' ? <SuccessMark /> : <GoogleMark />}
                            <span>{authState === 'loading' ? 'Signing you in...' : authState === 'success' ? 'Successfully signed in' : 'Continue with Google'}</span>
                        </button>

                        <div className="auth-divider" aria-hidden="true"><span /><p>or continue with</p><span /></div>

                        <div className="auth-socials" aria-label="Other sign-in providers">
                            <button className="auth-social-button" type="button" aria-label="Continue with Apple" data-tooltip="Apple" onClick={() => startAuthentication('Apple')} disabled={authState === 'loading'}><AppleMark /></button>
                            <button className="auth-social-button" type="button" aria-label="Continue with GitHub" data-tooltip="GitHub" onClick={() => startAuthentication('GitHub')} disabled={authState === 'loading'}><GithubMark /></button>
                            <button className="auth-social-button" type="button" aria-label="Continue with Microsoft" data-tooltip="Microsoft" onClick={() => startAuthentication('Microsoft')} disabled={authState === 'loading'}><MicrosoftMark /></button>
                        </div>

                        <button className="auth-button auth-button--email" type="button" onClick={openEmail}>
                            <MailMark /><span>Continue with email</span>
                        </button>
                    </>
                )}

                <p className="auth-signup">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button type="button" onClick={() => { setIsSignUp(!isSignUp); setEmailMode(true); setAuthState('idle'); setNotice('') }}>
                        {isSignUp ? 'Sign in' : 'Sign up'}
                    </button>
                </p>
                <p className="auth-legal">By continuing, you agree to our <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>.</p>
            </section>
        </main>
    )
}

export default Login
