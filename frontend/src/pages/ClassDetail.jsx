import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';
import Card from '../components/Card';
import PageHeader from '../components/PageHeader';

export default function ClassDetail(){
  const { id } = useParams();
  const [klass, setKlass] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    let mounted = true;
    (async ()=>{
      try{
        const res = await api.get(`/classes/${id}`);
        if(!mounted) return;
        setKlass(res.data || null);
      }catch(e){
        console.error(e);
        setKlass(null);
      }finally{ if(mounted) setLoading(false); }
    })();
    return ()=>{ mounted = false };
  },[id]);

  if(loading) return <div className="p-6">Loading…</div>;
  if(!klass) return <div className="p-6">Class not found</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <PageHeader title={klass.name} subtitle={`Section ${klass.section} • ${klass.year || ''}`} actions={<Link to="/classes" className="px-3 py-1 border rounded">Back</Link>} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <h3 className="text-lg font-medium mb-3">Subjects</h3>
          {(!klass.subjects || klass.subjects.length===0) ? (
            <div className="text-sm text-gray-500">No subjects defined</div>
          ) : (
            <div className="space-y-2">
              {klass.subjects.map((s,i)=> (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium">{s.name || s.code}</div>
                    <div className="text-sm text-gray-500">{s.code || ''}</div>
                  </div>
                  <div className="text-sm text-gray-600">{s.teacher || '—'}</div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h3 className="text-lg font-medium mb-3">Students</h3>
          {(!klass.students || klass.students.length===0) ? (
            <div className="text-sm text-gray-500">No students in this class</div>
          ) : (
            <div className="space-y-2">
              {klass.students.map(s=> (
                <div key={s._id || s.id} className="flex items-center justify-between">
                  <div className="text-sm">{s.name || s.fullName || s.registerNumber}</div>
                  <Link to={`/students/${s._id || s.id}`} className="text-brand text-sm">Profile →</Link>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
