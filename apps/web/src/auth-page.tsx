import { Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowLeft, LockKeyhole, ShieldCheck } from 'lucide-react'

export function AuthPage({ mode }: { mode: 'login' | 'signup' }) {
 const signup = mode === 'signup'
 const [error,setError]=useState(''),[busy,setBusy]=useState(false)
 const navigate=useNavigate()
 async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setError('');setBusy(true);const f=new FormData(e.currentTarget);try {const response=await fetch(`/api/auth/${signup?'sign-up':'sign-in'}/email`,{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({email:f.get('email'),password:f.get('password'),...(signup?{name:f.get('name')}:{})})});const data=await response.json();if(!response.ok)throw new Error(data.message||'Unable to continue. Please check your details.');await navigate({to:'/'});window.location.reload()}catch(e){setError(e instanceof Error?e.message:'Unable to contact the server.')}finally{setBusy(false)}}
 return <div className="auth-layout">
  <main className="auth-main"><div className="auth-top"><Link to="/" className="auth-back"><ArrowLeft size={15}/> Back to demo</Link><div>{signup?'Already have an account?':'New to Dueform?'} <Link to={signup?'/login':'/signup'}>{signup?'Log in':'Create account'}</Link></div></div>
   <div className="auth-content"><div className="auth-mobile-brand"><Link to="/" className="auth-brand"><span className="brandmark"><i/><i/><i/></span><strong>dueform</strong></Link></div><div className="auth-icon"><LockKeyhole size={20}/></div><div className="auth-eyebrow">{signup?'GET STARTED':'WELCOME BACK'}</div><h2>{signup?'Create your account':'Log in to Dueform'}</h2><p className="auth-intro">{signup?'Start building a clearer picture of your credit.':'Welcome back. Enter your details to continue.'}</p>
    <div className="auth-notice" role="status"><ShieldCheck size={18}/><div><strong>Local development</strong><p>Use test credentials only. Email verification and password reset are not yet configured.</p></div></div>
    <form className="auth-form" onSubmit={submit}>{signup&&<label htmlFor="name">Full name<input id="name" name="name" type="text" placeholder="Your name" autoComplete="name" required/></label>}<label htmlFor="email">Email address<input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required/></label><label htmlFor="password">Password<input id="password" name="password" type="password" placeholder={signup?'Create a password':'Enter your password'} autoComplete={signup?'new-password':'current-password'} minLength={10} required/></label>{signup&&<p className="password-hint">Use at least 10 characters.</p>}{error&&<p className="auth-error" role="alert">{error}</p>}<button className="auth-submit" disabled={busy}>{busy?'Please wait…':signup?'Create account':'Log in'}</button></form>
    <div className="auth-divider"><span/>OR<span/></div><Link className="auth-demo-link" to="/">Explore the demo workspace</Link><p className="auth-switch">{signup?'Already have an account?':'Don’t have an account?'} <Link to={signup?'/login':'/signup'}>{signup?'Log in':'Create account'}</Link></p>
   </div><div className="auth-main-footer"><span>Built for a clearer financial picture.</span><span>Demo preview</span></div>
  </main>
 </div>
}
