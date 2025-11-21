import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';

export default function StudentsPage(){
  const [students, setStudents] = useState([]);
  const [q, setQ] = useState('');

  const fetchStudents = async () => {
    try {
      const res = await api.get('/students');
      setStudents(res.data || []);
    } catch(e) {
      console.error(e);
      setStudents([]);
    }
  };

  useEffect(()=>{ fetchStudents(); },[]);

  const filtered = students.filter(s => (s.name||'').toLowerCase().includes(q.toLowerCase()) || (s.registerNumber||'').includes(q));

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Students</h2>
        <div className="flex gap-2">
          <Link to="/students/new" className="px-4 py-2 bg-brand text-white rounded shadow">Add Student</Link>
        </div>
      </div>

      <div className="mb-4">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by name or reg no"
          className="w-full p-3 border rounded-md bg-white" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(s => (
          <div key={s._id} className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-lg">{s.name}</div>
                <div className="text-sm text-gray-500">{s.registerNumber || '—'}</div>
              </div>
              <div className="text-sm text-gray-500">{s.className || ''}</div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="text-sm text-gray-600">{(s.marks||[]).length} marks recorded</div>
              <Link className="text-brand text-sm font-medium" to={`/students/${s._id}`}>View profile →</Link>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="text-gray-500">No students found</div>}
      </div>
    </div>
  );
}
