import React from 'react';

export default function SummaryCard({ summary }) {
  const wendy = summary?.wendy_total || 0;
  const daniel = summary?.daniel_total || 0;
  const total = wendy + daniel;

  return (
    <div className="px-5">
      <div className="notion-card p-5">
        <div className="flex items-baseline justify-between mb-4">
          <span className="text-sm font-medium text-warm-gray-500">本月总支出</span>
          <span className="text-[40px] font-bold leading-none tracking-tight text-notion-black">
            ¥{total.toFixed(0)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-micro bg-warm-white p-4">
            <div className="text-xs font-medium text-warm-gray-500 mb-1">Wendy 支出</div>
            <div className="text-[22px] font-bold tracking-card text-notion-black">
              ¥{wendy.toFixed(0)}
            </div>
            {total > 0 && (
              <div className="text-xs text-warm-gray-300 mt-1">
                {((wendy / total) * 100).toFixed(0)}%
              </div>
            )}
          </div>

          <div className="rounded-micro bg-warm-white p-4">
            <div className="text-xs font-medium text-warm-gray-500 mb-1">Daniel 支出</div>
            <div className="text-[22px] font-bold tracking-card text-notion-black">
              ¥{daniel.toFixed(0)}
            </div>
            {total > 0 && (
              <div className="text-xs text-warm-gray-300 mt-1">
                {((daniel / total) * 100).toFixed(0)}%
              </div>
            )}
          </div>
        </div>

        {summary?.income_total > 0 && (
          <div className="mt-4 pt-4 whisper-border-t border-t border-black/5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-warm-gray-500">期间收入</span>
              <span className="text-lg font-bold text-green">+¥{summary.income_total.toFixed(0)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
