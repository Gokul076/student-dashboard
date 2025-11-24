import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import PageHeader from '../components/PageHeader';

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
      <PageHeader
        title="Students"
        subtitle="Browse and manage student records"
        actions={<Link to="/students/new" className="px-4 py-2 bg-brand text-white rounded shadow">Add Student</Link>}
      />

      <div className="mb-4">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by name or reg no"
          className="w-full p-3 border rounded-md bg-white" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(s => (
          <Card key={s._id} className="hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-lg">{s.name}</div>
                <div className="text-sm text-gray-500">{s.registerNumber || '—'}</div>
              </div>
              <div className="text-sm text-gray-500">{s.className || ''}</div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="text-sm text-gray-600">{(s.marks||[]).length} marks recorded</div>
              <div className="flex items-center gap-3">
                <Link className="text-brand text-sm font-medium" to={`/students/${s._id}`}>View →</Link>
                <button
                  type="button"
                  onClick={async () => {
                    if (!confirm('Delete this student?')) return;
                    try {
                      await api.delete(`/students/${s._id}`);
                      setStudents(prev => prev.filter(x => x._id !== s._id));
                    } catch (e) { console.error(e); alert('Delete failed'); }
                  }}
                  className="text-sm text-red-600"
                >Delete</button>
              </div>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && <div className="text-gray-500">No students found</div>}
      </div>
    </div>
  );
}
