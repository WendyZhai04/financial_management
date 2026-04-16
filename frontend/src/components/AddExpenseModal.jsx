import React, { useState, useEffect } from 'react';

const CATEGORIES = ['买菜', '餐饮', '购物', '交通', '娱乐', '日用', '学习', '医疗', '订阅', '其他'];

export default function AddExpenseModal({ isOpen, onClose, onSave, initialData, defaultPayer }) {
  const [form, setForm] = useState({
    type: 'expense',
    amount: '',
    category: '买菜',
    payer: defaultPayer || 'Wendy',
    is_personal: false,
    note: '',
    date: new Date().toISOString().split('T')[0],
    receipt_image: '',
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        type: initialData.type || 'expense',
        amount: initialData.amount || '',
        category: initialData.category || '其他',
        payer: initialData.payer || defaultPayer || 'Wendy',
        is_personal: !!initialData.is_personal,
        note: initialData.note || '',
        date: initialData.date || new Date().toISOString().split('T')[0],
        receipt_image: initialData.receipt_image || '',
      });
    } else {
      setForm({
        type: 'expense',
        amount: '',
        category: '买菜',
        payer: defaultPayer || 'Wendy',
        is_personal: false,
        note: '',
        date: new Date().toISOString().split('T')[0],
        receipt_image: '',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || Number(form.amount) <= 0) return;
    onSave({ ...form, amount: Number(form.amount) });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      setForm((f) => ({ ...f, receipt_image: data.url }));
    } catch (err) {
      alert('上传失败');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30">
      <div className="bg-white w-full max-w-md sm:rounded-comfortable rounded-t-comfortable shadow-deep max-h-[90vh] overflow-y-auto">
        <div className="px-5 py-4 border-b border-black/5 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-card">
            {initialData ? '编辑记录' : '记一笔'}
          </h2>
          <button onClick={onClose} className="text-warm-gray-300 hover:text-warm-gray-500 text-xl">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setForm({ ...form, type: 'expense' })}
              className={`flex-1 py-2 rounded-micro text-sm font-semibold transition ${
                form.type === 'expense'
                  ? 'bg-notion-blue text-white'
                  : 'bg-warm-white text-warm-gray-500'
              }`}
            >
              支出
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, type: 'income' })}
              className={`flex-1 py-2 rounded-micro text-sm font-semibold transition ${
                form.type === 'income'
                  ? 'bg-green text-white'
                  : 'bg-warm-white text-warm-gray-500'
              }`}
            >
              收入
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-warm-gray-500 mb-1">金额</label>
            <input
              type="number"
              step="0.01"
              required
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="notion-input"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-warm-gray-500 mb-1">分类</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setForm({ ...form, category: cat })}
                  className={`px-3 py-1.5 rounded-pill text-xs font-semibold transition ${
                    form.category === cat
                      ? 'bg-notion-blue text-white'
                      : 'bg-warm-white text-warm-gray-500 hover:bg-black/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-warm-gray-500 mb-1">付款人 / 收款人</label>
            <div className="flex gap-3">
              {['Wendy', 'Daniel'].map((p) => (
                <label key={p} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="payer"
                    checked={form.payer === p}
                    onChange={() => setForm({ ...form, payer: p })}
                    className="accent-notion-blue"
                  />
                  <span className="text-sm text-notion-black">{p}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="personal"
              type="checkbox"
              checked={form.is_personal}
              onChange={(e) => setForm({ ...form, is_personal: e.target.checked })}
              className="accent-notion-blue w-4 h-4"
            />
            <label htmlFor="personal" className="text-sm text-notion-black cursor-pointer">
              标记为个人消费
            </label>
          </div>

          <div>
            <label className="block text-xs font-medium text-warm-gray-500 mb-1">日期</label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="notion-input"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-warm-gray-500 mb-1">备注</label>
            <input
              type="text"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="notion-input"
              placeholder="例如：永辉超市、朋友聚餐…"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-warm-gray-500 mb-1">上传凭证</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm" />
            {form.receipt_image && (
              <img
                src={form.receipt_image}
                alt="receipt"
                className="mt-2 w-20 h-20 object-cover rounded-standard whisper-border"
              />
            )}
          </div>

          <div className="pt-2">
            <button type="submit" className="w-full notion-btn-primary">
              {initialData ? '保存修改' : '确认记账'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
