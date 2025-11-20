import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { Link } from 'react-router-dom';

export default function ClassesList(){
  const [list, setList] = useState([]);
  useEffect(()=> {
    API.get('/classes').then(r=>setList(r.data)).catch(()=>setList([]));
  }, []);
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Classes</h2>
        <Link to="/classes/new" className="py-1 px-3 bg-indigo-600 text-white rounded">Create class</Link>
      </div>
      <div className="grid gap-3">
        {list.length===0 && <div className="p-4 text-gray-500">No classes yet</div>}
        {list.map(c=>(
          <div key={c._id} className="p-4 border rounded flex justify-between items-center">
            <div>
              <div className="font-medium">{c.name} — {c.section}</div>
              <div className="text-sm text-gray-500">{(c.subjects||[]).map(s=>s.code).join(', ')}</div>
            </div>
            <div className="text-sm text-gray-500">{c.year}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
