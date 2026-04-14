import React from 'react';

export default function DateRangePicker({ startDate, endDate, onChangeRange }) {
  const presets = [
    { label: '本月', key: 'month' },
    { label: '本周', key: 'week' },
    { label: '上月', key: 'last_month' },
  ];

  const applyPreset = (key) => {
    const today = new Date();
    let s, e;
    if (key === 'month') {
      s = new Date(today.getFullYear(), today.getMonth(), 1);
      e = today;
    } else if (key === 'week') {
      const day = today.getDay() || 7;
      s = new Date(today);
      s.setDate(today.getDate() - day + 1);
      e = today;
    } else if (key === 'last_month') {
      s = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      e = new Date(today.getFullYear(), today.getMonth(), 0);
    }
    onChangeRange({
      start: s.toISOString().split('T')[0],
      end: e.toISOString().split('T')[0],
    });
  };

  return (
    <div className="bg-white px-5 pt-3 pb-3">
      <div className="flex items-center gap-2 mb-3">
        {presets.map((p) => (
          <button
            key={p.key}
            onClick={() => applyPreset(p.key)}
            className="px-3 py-1.5 rounded-micro bg-black/5 text-notion-black text-xs font-semibold hover:bg-black/10 active:scale-95 transition"
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={startDate}
          onChange={(e) => onChangeRange({ start: e.target.value })}
          className="notion-input text-sm py-1.5 flex-1"
        />
        <span className="text-warm-gray-300 text-sm">至</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onChangeRange({ end: e.target.value })}
          className="notion-input text-sm py-1.5 flex-1"
        />
      </div>
    </div>
  );
}
