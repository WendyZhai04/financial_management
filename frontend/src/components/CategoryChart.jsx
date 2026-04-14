import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = [
  '#0075de', '#2a9d99', '#1aae39', '#dd5b00', '#ff64c8', '#391c57', '#523410', '#a39e98'
];

export default function CategoryChart({ categories }) {
  if (!categories || categories.length === 0) {
    return (
      <div className="px-5 mt-6">
        <h3 className="text-lg font-bold tracking-card mb-3">分类统计</h3>
        <div className="notion-card p-8 text-center text-warm-gray-300 text-sm">
          该时段暂无支出数据
        </div>
      </div>
    );
  }

  const data = categories.map((c) => ({ name: c.category, value: c.total }));
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="px-5 mt-6">
      <h3 className="text-lg font-bold tracking-card mb-3">分类统计</h3>
      <div className="notion-card p-4">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `¥${value.toFixed(0)}`}
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid rgba(0,0,0,0.1)',
                  boxShadow: 'rgba(0,0,0,0.04) 0px 4px 18px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 space-y-2">
          {data.map((item, idx) => {
            const percent = ((item.value / total) * 100).toFixed(0);
            return (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                  <span className="text-sm text-notion-black font-medium">{item.name}</span>
                </div>
                <div className="text-sm text-warm-gray-500">
                  ¥{item.value.toFixed(0)}
                  <span className="ml-1 text-warm-gray-300">({percent}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
