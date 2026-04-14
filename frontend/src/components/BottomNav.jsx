import React from 'react';

const tabs = [
  { key: 'record', label: '记账', icon: '➕' },
  { key: 'home',   label: '概览', icon: '📊' },
  { key: 'detail', label: '明细', icon: '📝' },
];

export default function BottomNav({ current, onChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-black/5 z-40">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const active = current === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className={`flex-1 flex flex-col items-center py-2.5 transition ${
                active ? 'text-notion-blue' : 'text-warm-gray-300'
              }`}
            >
              <span className="text-xl mb-0.5">{tab.icon}</span>
              <span className={`text-[11px] font-medium ${active ? 'font-semibold' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
