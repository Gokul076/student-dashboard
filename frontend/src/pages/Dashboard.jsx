import React from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const sampleTrend = [
  { term: 'Term 1', avg: 62 },
  { term: 'Term 2', avg: 71 },
  { term: 'Term 3', avg: 78 },
  { term: 'Term 4', avg: 83 },
  { term: 'Term 5', avg: 86 }
];

const classComparison = [
  { name: 'Class A', avg: 82 },
  { name: 'Class B', avg: 76 },
  { name: 'Class C', avg: 69 }
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Overview</h1>
          <p className="text-sm text-gray-500">Quick summary of student performance and class trends.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/students" className="px-4 py-2 bg-brand text-white rounded shadow">Students</Link>
          <Link to="/classes" className="px-4 py-2 border border-gray-200 rounded">Classes</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2 bg-white rounded shadow p-4">
          <h3 className="text-sm text-gray-600 mb-2">Average Score Trend</h3>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer>
              <LineChart data={sampleTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="term" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="avg" stroke="#6d28d9" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded shadow p-4">
          <h3 className="text-sm text-gray-600 mb-2">Class Comparison</h3>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={classComparison} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" />
                <Tooltip />
                <Bar dataKey="avg" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded shadow p-4">
          <h4 className="font-medium">Top Performer</h4>
          <div className="text-sm text-gray-600">Asha K. — Avg 94%</div>
        </div>
        <div className="bg-white rounded shadow p-4">
          <h4 className="font-medium">Most Improved</h4>
          <div className="text-sm text-gray-600">Ravi P. — +18%</div>
        </div>
        <div className="bg-white rounded shadow p-4">
          <h4 className="font-medium">Attention Needed</h4>
          <div className="text-sm text-gray-600">2 students below 40% in Math</div>
        </div>
      </div>
    </div>
  );
}
