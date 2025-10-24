import React, { useState } from 'react'
import { endpoints } from './api'

export default function Login({ onLogin }){
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('changeme')
  const [error, setError] = useState(null)

  async function submit(e){
    e.preventDefault();
    try{
      const res = await fetch(endpoints.login, { 
        method: 'POST', 
        headers: {'Content-Type':'application/json'}, 
        body: JSON.stringify({ username, password }) 
      });
      if (!res.ok) throw new Error('Auth failed');
      const j = await res.json();
      onLogin(j.token);
    }catch(err){ setError(err.message) }
  }

  return (
    <div style={{padding:20}}>
      <h2>Admin Login</h2>
      <form onSubmit={submit}>
        <div><input value={username} onChange={e=>setUsername(e.target.value)} /></div>
        <div><input type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
        <div><button type="submit">Login</button></div>
        {error && <div style={{color:'red'}}>{error}</div>}
      </form>
    </div>
  )
}
