import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import Card from '../components/Card';
import PageHeader from '../components/PageHeader';

export default function StudentProfile() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [examName, setExamName] = useState('');
  const [examDate, setExamDate] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [subjectScore, setSubjectScore] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [sRes, mRes] = await Promise.all([
          api.get(`/students/${id}`),
          api.get(`/marks/student/${id}`).catch(() => ({ data: [] }))
        ]);
        if (!mounted) return;
        setStudent(sRes.data || null);
        setMarks(mRes.data || []);
      } catch (e) {
        console.error(e);
        setStudent(null);
        setMarks([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

    const marksData = (marks || []).map(m => {
      // m may be a Mark document or embedded shape
      if (m.subjects && Array.isArray(m.subjects) && m.subjects.length) {
        return { name: m.subjects[0].subject || m.subjects[0].subjectName || 'Subject', score: m.subjects[0].score ?? m.subjects[0].mark ?? 0 };
      }
      return { name: m.subject || m.subjectName || m.code || 'Subject', score: m.score || m.mark || 0 };
    });

  if (loading) return <div className="p-6">Loading…</div>;
  if (!student) return <div className="p-6">Student not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <PageHeader title={student.name} subtitle={`Reg: ${student.registerNumber || '—'}`} actions={<Link to="/students" className="px-3 py-1 border rounded">Back</Link>} />

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">{student.name}</h2>
            <div className="text-sm text-gray-500">Reg: {student.registerNumber || '—'}</div>
          </div>
          <div className="text-sm text-gray-600">Class: {student.className || student.class || '—'}</div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded bg-gray-50">
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

          <div className="p-4 rounded bg-gray-50">
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
          </Card>
          <div className="mt-4">
            <Card>
              <h4 className="text-sm text-gray-600 mb-3">Add Mark</h4>
              <form onSubmit={async (e) => {
                e.preventDefault();
                if (!subjectName || !subjectScore) return alert('Provide subject and score');
                setAdding(true);
                try {
                  const payload = {
                    studentId: id,
                    classId: student.classId || student.class || null,
                    exam: { name: examName || 'Exam', date: examDate || new Date().toISOString() },
                    subjects: [{ subject: subjectName, score: Number(subjectScore) }]
                  };
                  await api.post('/marks', payload);
                  // refresh marks
                  const res = await api.get(`/marks/student/${id}`);
                  setMarks(res.data || []);
                  setExamName(''); setExamDate(''); setSubjectName(''); setSubjectScore('');
                } catch (err) {
                  console.error(err);
                  alert('Failed to add mark');
                } finally { setAdding(false); }
              }} className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <input placeholder="Exam name" value={examName} onChange={e=>setExamName(e.target.value)} className="p-2 border rounded col-span-2" />
                  <input type="date" value={examDate} onChange={e=>setExamDate(e.target.value)} className="p-2 border rounded" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <input placeholder="Subject" value={subjectName} onChange={e=>setSubjectName(e.target.value)} className="p-2 border rounded col-span-2" />
                  <input placeholder="Score" value={subjectScore} onChange={e=>setSubjectScore(e.target.value)} className="p-2 border rounded" />
                </div>
                <div className="flex justify-end">
                  <button type="submit" disabled={adding} className={`py-2 px-4 rounded text-white ${adding ? 'bg-gray-400' : 'bg-brand'}`}>Add Mark</button>
                </div>
              </form>
            </Card>
          </div>
    </div>
  );
}
