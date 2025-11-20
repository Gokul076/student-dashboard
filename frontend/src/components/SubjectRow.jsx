import React from 'react';

export default function SubjectRow({ idx, subject, onChange, onRemove }) {
  return (
    <div className="grid grid-cols-12 gap-2 items-center">
      <input
        className="col-span-3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
        placeholder="Subject code (eg. 22MDC31)"
        value={subject.code}
        onChange={e => onChange(idx, { ...subject, code: e.target.value })}
      />
      <input
        className="col-span-6 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
        placeholder="Subject name (eg. DBMS)"
        value={subject.name}
        onChange={e => onChange(idx, { ...subject, name: e.target.value })}
      />
      <button
        type="button"
        onClick={() => onRemove(idx)}
        className="col-span-2 py-2 px-3 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
      >
        Remove
      </button>
    </div>
  );
}
