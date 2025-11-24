import React, { useState } from 'react';
import API from '../api/api';
import SubjectRow from '../components/SubjectRow';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import PageHeader from '../components/PageHeader';

export default function CreateClass(){
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [section, setSection] = useState('');
  const [subjects, setSubjects] = useState([{ code: '', name: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  function updateSubject(idx, val){
    setSubjects(s => s.map((it,i)=> i===idx ? val : it));
  }
  function addSubject(){ setSubjects(s => [...s, { code:'', name:'' }]); }
  function removeSubject(idx){ setSubjects(s => s.filter((_,i)=> i!==idx)); }

  function validate(){
    if(!name.trim()) return "Class name is required";
    if(!section.trim()) return "Section is required";
    const hasInvalid = subjects.some(s => !s.code.trim() || !s.name.trim());
    if(hasInvalid) return "All subject rows must have code and name";
    return null;
  }

  async function handleSubmit(e){
    e.preventDefault();
    setError(null);
    setSuccessMsg('');
    const v = validate();
    if(v){ setError(v); window.scrollTo(0,0); return; }
    setLoading(true);
    try{
      const payload = { name, year: Number(year), section, subjects };
      await API.post('/classes', payload);
      setSuccessMsg('Class created successfully');
      setTimeout(()=> nav('/classes'), 900);
    }catch(err){
      setError(err?.response?.data?.error || err.message || 'Server error');
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <PageHeader title="Create Class" subtitle="Define class meta and subjects — dynamic rows and validation included." actions={null} />

      {error && <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-md">{error}</div>}
      {successMsg && <div className="mb-4 p-3 bg-green-50 text-green-800 rounded-md">{successMsg}</div>}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <label className="col-span-3">
              <div className="text-sm font-medium text-gray-700">Class name</div>
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="22MDC-A"
                className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-200" />
            </label>

            <label>
              <div className="text-sm font-medium text-gray-700">Year</div>
              <input type="number" value={year} onChange={e=>setYear(e.target.value)}
                className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-200"/>
            </label>

            <label>
              <div className="text-sm font-medium text-gray-700">Section</div>
              <input value={section} onChange={e=>setSection(e.target.value)} placeholder="A"
                className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-200"/>
            </label>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-md font-medium text-gray-700">Subjects</h3>
              <button type="button" onClick={addSubject}
                className="py-1 px-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                + Add subject
              </button>
            </div>

            <div className="space-y-3">
              {subjects.map((s, i) => (
                <div key={i} className="p-3 border rounded-md bg-gray-50">
                  <SubjectRow idx={i} subject={s} onChange={updateSubject} onRemove={removeSubject}/>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button type="button" onClick={()=> { setName(''); setSection(''); setSubjects([{code:'',name:''}]); }}
              className="py-2 px-4 border rounded-md">Reset</button>

            <button type="submit"
              className={`py-2 px-4 rounded-md text-white ${loading ? 'bg-gray-400' : 'bg-brand'}`}
              disabled={loading}>
              {loading ? 'Creating...' : 'Create Class'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
