import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

export default function StudentProfile() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get(`/students/${id}`);
        if (!mounted) return;
        setStudent(res.data || null);
      } catch (e) {
        console.error(e);
        setStudent(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const marksData = (student?.marks || []).map(m => ({ name: m.subject || m.subjectName || m.code || 'Subject', score: m.score || m.mark || 0 }));

  if (loading) return <div className="p-6">Loading…</div>;
  if (!student) return <div className="p-6">Student not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white p-6 rounded shadow">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">{student.name}</h2>
            <div className="text-sm text-gray-500">Reg: {student.registerNumber || '—'}</div>
          </div>
          <div className="text-sm text-gray-600">Class: {student.className || student.class || '—'}</div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="text-sm text-gray-600 mb-2">Marks Overview</h4>
            {marksData.length === 0 && <div className="text-gray-500">No marks recorded</div>}
            {marksData.length > 0 && (
              <div style={{ width: '100%', height: 220 }}>
                <ResponsiveContainer>
                  <LineChart data={marksData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#6d28d9" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <h4 className="text-sm text-gray-600 mb-2">Recent Marks</h4>
            <div className="space-y-2">
              {(student.marks || []).slice(0,6).map((m, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="text-sm">{m.subject || m.subjectName || m.code || 'Subject'}</div>
                  <div className="text-sm font-medium">{m.score ?? m.mark ?? 0}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
