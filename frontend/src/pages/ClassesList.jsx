import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import PageHeader from '../components/PageHeader';

export default function ClassesList(){
  const [list, setList] = useState([]);
  useEffect(()=> {
    API.get('/classes').then(r=>setList(r.data || [])).catch(()=>setList([]));
  }, []);
  return (
    <div className="max-w-6xl mx-auto p-6">
      <PageHeader title="Classes" subtitle="Manage class groups and subjects" actions={<Link to="/classes/new" className="py-2 px-4 bg-brand text-white rounded shadow">Create class</Link>} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.length===0 && <div className="p-4 text-gray-500">No classes yet</div>}
        {list.map(c=> (
          <Card key={c._id}>
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium text-lg">{c.name} <span className="text-sm text-gray-500">— {c.section}</span></div>
                <div className="text-sm text-gray-500 mt-1">{(c.subjects||[]).map(s=>s.code || s.name).join(', ')}</div>
              </div>
              <div className="text-sm text-gray-500">{c.year}</div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <Link to={`/classes/${c._id}`} className="text-brand text-sm font-medium">View →</Link>
              <div className="text-sm text-gray-500">{(c.students||[]).length || 0} students</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
