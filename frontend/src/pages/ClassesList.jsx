import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { Link } from 'react-router-dom';

export default function ClassesList(){
  const [list, setList] = useState([]);
  useEffect(()=> {
    API.get('/classes').then(r=>setList(r.data || [])).catch(()=>setList([]));
  }, []);
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Classes</h2>
        <Link to="/classes/new" className="py-2 px-4 bg-brand text-white rounded shadow">Create class</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.length===0 && <div className="p-4 text-gray-500">No classes yet</div>}
        {list.map(c=>(
          <div key={c._id} className="p-4 bg-white rounded-lg shadow">
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
          </div>
        ))}
      </div>
    </div>
  );
}
