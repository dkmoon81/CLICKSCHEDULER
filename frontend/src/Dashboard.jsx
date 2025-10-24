import React, { useEffect, useState } from 'react'
import { endpoints, fetchWithAuth } from './api'

export default function Dashboard({ token, onLogout }){
  const [job, setJob] = useState(null)
  const [form, setForm] = useState({ url:'', clickSelector:'#target', frequencySeconds:3600, enabled:true })
  const [status, setStatus] = useState(null)

  useEffect(()=>{ load() }, [])
  async function load(){
    const res = await fetchWithAuth(endpoints.job);
    if (res.ok) setJob(await res.json())
  }

  async function save(){
    const res = await fetchWithAuth(endpoints.job, {
      method: 'POST',
      body: JSON.stringify(form)
    });
    if (res.ok) setJob(await res.json())
  }

  async function trigger(){
    const res = await fetchWithAuth(endpoints.jobTrigger, { method: 'POST' });
    if (res.ok) setStatus(await res.json())
  }

  async function del(){
    await fetchWithAuth(endpoints.job, { method: 'DELETE' });
    setJob(null)
  }

  return (
    <div style={{padding:20}}>
      <h2>Dashboard</h2>
      <button onClick={onLogout}>Logout</button>
      <div style={{marginTop:20}}>
        <h3>Current Job</h3>
        <pre>{JSON.stringify(job, null, 2)}</pre>
      </div>
      <div style={{marginTop:20}}>
        <h3>Edit/Create Job</h3>
        <div><input placeholder="URL" value={form.url} onChange={e=>setForm({...form, url:e.target.value})} style={{width:400}} /></div>
        <div><input placeholder="Click selector" value={form.clickSelector} onChange={e=>setForm({...form, clickSelector:e.target.value})} /></div>
        <div><input type="number" placeholder="frequencySeconds" value={form.frequencySeconds} onChange={e=>setForm({...form, frequencySeconds:parseInt(e.target.value||0)})} /></div>
        <div><label><input type="checkbox" checked={form.enabled} onChange={e=>setForm({...form, enabled:e.target.checked})} /> Enabled</label></div>
        <div><button onClick={save}>Save Job</button> <button onClick={trigger}>Manual Trigger</button> <button onClick={del}>Delete</button></div>
      </div>
      <div style={{marginTop:20}}>
        <h3>Last action status</h3>
        <pre>{JSON.stringify(status, null, 2)}</pre>
      </div>
    </div>
  )
}
