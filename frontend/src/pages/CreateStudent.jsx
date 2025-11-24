import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import Card from '../components/Card';
import PageHeader from '../components/PageHeader';

export default function CreateStudent(){
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [registerNumber, setRegisterNumber] = useState('');
  const [classId, setClassId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [classes, setClasses] = useState([]);
  const [classesLoading, setClassesLoading] = useState(false);

  async function submit(e){
    e.preventDefault();
    setError(null);
    if(!name || !registerNumber){ setError('Name and register number required'); return; }
    setLoading(true);
    try{
      const payload = { name, registerNumber };
      if (classId) payload.classId = classId;
      await api.post('/students', payload);
      nav('/students');
    }catch(err){
      setError(err?.response?.data?.error || err.message || 'Failed');
    }finally{ setLoading(false); }
  }

  useEffect(() => {
    let mounted = true;
    async function load() {
      setClassesLoading(true);
      try {
        const res = await api.get('/classes');
        if (!mounted) return;
        setClasses(res.data || []);
      } catch (e) {
        console.warn('Failed to load classes', e);
      } finally {
        if (mounted) setClassesLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <PageHeader title="Add Student" subtitle="Create a single student record" />
      <Card>
        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
        <form onSubmit={submit} className="space-y-4">
          <label>
            <div className="text-sm text-gray-700">Full name</div>
            <input value={name} onChange={e=>setName(e.target.value)} className="mt-1 w-full p-2 border rounded" />
          </label>

          <label>
            <div className="text-sm text-gray-700">Register number</div>
            <input value={registerNumber} onChange={e=>setRegisterNumber(e.target.value)} className="mt-1 w-full p-2 border rounded" />
          </label>

          <label>
            <div className="text-sm text-gray-700">Class</div>
            <select value={classId} onChange={e=>setClassId(e.target.value)} className="mt-1 w-full p-2 border rounded">
              <option value="">(None) — choose a class</option>
              {classes.map(c => (
                <option key={c._id} value={c._id}>{c.name}{c.section ? ` — ${c.section}` : ''}</option>
              ))}
            </select>
            {classesLoading && <div className="text-xs text-gray-500 mt-1">Loading classes…</div>}
          </label>

          {classes.length === 0 && !classesLoading && (
            <div className="text-sm text-yellow-700">No classes available. Create a class first before adding students.</div>
          )}

          <div className="flex justify-end">
            <button type="submit" disabled={loading || classes.length === 0} className={`py-2 px-4 rounded text-white ${loading ? 'bg-gray-400' : 'bg-brand'}`}>
              {loading ? 'Saving…' : 'Create Student'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
