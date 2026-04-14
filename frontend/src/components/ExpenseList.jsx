import React from 'react';

const CATEGORY_EMOJI = {
  '买菜': '🥬',
  '餐饮': '🍽️',
  '购物': '🛒',
  '交通': '🚕',
  '娱乐': '🎬',
  '日用': '🧻',
  '学习': '📚',
  '医疗': '💊',
  '订阅': '🔄',
  '其他': '📝',
};

export default function ExpenseList({ expenses, onEdit, onDelete, onRefresh }) {
  const formatDate = (d) => {
    const date = new Date(d);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const grouped = expenses.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="px-5 mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold tracking-card">收支明细</h3>
        <button onClick={onRefresh} className="text-xs text-notion-blue font-medium hover:underline">
          刷新
        </button>
      </div>

      {sortedDates.length === 0 && (
        <div className="notion-card p-8 text-center text-warm-gray-300 text-sm">
          暂无记录
        </div>
      )}

      <div className="space-y-4">
        {sortedDates.map((date) => (
          <div key={date}>
            <div className="text-xs font-semibold text-warm-gray-300 mb-2 tracking-badge">
              {formatDate(date)}
            </div>
            <div className="notion-card overflow-hidden">
              {grouped[date].map((item, idx) => {
                const isIncome = item.type === 'income';
                const emoji = isIncome ? '💰' : (CATEGORY_EMOJI[item.category] || '📝');
                const amountClass = isIncome ? 'text-green' : 'text-notion-black';
                const sign = isIncome ? '+' : '-';
                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between px-4 py-3 ${
                      idx !== grouped[date].length - 1 ? 'border-b border-black/5' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-standard bg-warm-white flex items-center justify-center text-base">
                        {emoji}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-notion-black">
                          {item.category}
                          {item.is_personal ? (
                            <span className="ml-1.5 notion-pill py-0.5 px-1.5 text-[10px]">个人</span>
                          ) : null}
                        </div>
                        <div className="text-xs text-warm-gray-500 mt-0.5">
                          {item.note || '无备注'} · {item.payer}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-bold ${amountClass}`}>
                        {sign}¥{item.amount.toFixed(item.amount % 1 === 0 ? 0 : 2)}
                      </div>
                      <div className="flex items-center justify-end gap-2 mt-1">
                        <button
                          onClick={() => onEdit(item)}
                          className="text-[11px] text-warm-gray-300 hover:text-warm-gray-500"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          className="text-[11px] text-warm-gray-300 hover:text-orange"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
