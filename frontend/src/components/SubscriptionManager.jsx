import React, { useState, useEffect } from 'react';
import { api } from '../api';

const CATEGORIES = ['订阅', '娱乐', '日用', '交通', '学习', '医疗', '其他'];

export default function SubscriptionManager({ isOpen, onClose }) {
  const [subs, setSubs] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '',
    amount: '',
    category: '订阅',
    payer: 'Wendy',
    is_personal: false,
    day_of_month: 1,
    is_active: true,
  });

  useEffect(() => {
    if (isOpen) loadSubs();
  }, [isOpen]);

  const loadSubs = async () => {
    try {
      const data = await api.getSubscriptions();
      setSubs(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = { ...form, amount: Number(form.amount) };
    try {
      if (editing) {
        await api.updateSubscription(editing.id, payload);
      } else {
        await api.addSubscription(payload);
      }
      setIsFormOpen(false);
      setEditing(null);
      resetForm();
      loadSubs();
    } catch (err) {
      alert('保存失败');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('确定删除这个订阅吗？已生成的历史记录不会受影响。')) return;
    try {
      await api.deleteSubscription(id);
      loadSubs();
    } catch (err) {
      alert('删除失败');
    }
  };

  const handleToggle = async (sub) => {
    try {
      await api.updateSubscription(sub.id, { ...sub, is_active: !sub.is_active });
      loadSubs();
    } catch (err) {
      alert('操作失败');
    }
  };

  const resetForm = () => {
    setForm({
      name: '', amount: '', category: '订阅', payer: 'Wendy',
      is_personal: false, day_of_month: 1, is_active: true,
    });
  };

  const startEdit = (sub) => {
    setEditing(sub);
    setForm({
      name: sub.name,
      amount: sub.amount,
      category: sub.category,
      payer: sub.payer,
      is_personal: !!sub.is_personal,
      day_of_month: sub.day_of_month,
      is_active: !!sub.is_active,
    });
    setIsFormOpen(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30">
      <div className="bg-white w-full max-w-md sm:rounded-comfortable rounded-t-comfortable shadow-deep max-h-[90vh] overflow-y-auto">
        <div className="px-5 py-4 border-b border-black/5 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-card">订阅管理</h2>
          <button onClick={onClose} className="text-warm-gray-300 hover:text-warm-gray-500 text-xl">×</button>
        </div>

        <div className="px-5 py-4">
          {subs.length === 0 && (
            <div className="text-center text-sm text-warm-gray-300 py-6">
              还没有订阅，点击下方按钮添加
            </div>
          )}

          <div className="space-y-3">
            {subs.map((sub) => (
              <div key={sub.id} className="notion-card p-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-notion-black flex items-center gap-2">
                    {sub.name}
                    {!sub.is_active && (
                      <span className="px-1.5 py-0.5 rounded-pill bg-warm-white text-warm-gray-300 text-[10px]">已暂停</span>
                    )}
                  </div>
                  <div className="text-xs text-warm-gray-500 mt-0.5">
                    ¥{sub.amount} / {sub.category} / 每月{sub.day_of_month}日 / {sub.payer}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggle(sub)}
                    className={`text-xs px-2 py-1 rounded-micro font-medium ${
                      sub.is_active ? 'bg-orange/10 text-orange' : 'bg-green/10 text-green'
                    }`}
                  >
                    {sub.is_active ? '暂停' : '恢复'}
                  </button>
                  <button
                    onClick={() => startEdit(sub)}
                    className="text-xs text-warm-gray-300 hover:text-warm-gray-500 px-1"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleDelete(sub.id)}
                    className="text-xs text-warm-gray-300 hover:text-orange px-1"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>

          {!isFormOpen && (
            <button
              onClick={() => { setEditing(null); resetForm(); setIsFormOpen(true); }}
              className="w-full mt-4 notion-btn-secondary"
            >
              + 添加新订阅
            </button>
          )}

          {isFormOpen && (
            <form onSubmit={handleSave} className="mt-4 pt-4 border-t border-black/5 space-y-3">
              <div>
                <label className="block text-xs font-medium text-warm-gray-500 mb-1">订阅名称</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="notion-input"
                  placeholder="例如：Apple Music、Kimi 会员"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-warm-gray-500 mb-1">金额</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="notion-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-warm-gray-500 mb-1">每月扣款日</label>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    required
                    value={form.day_of_month}
                    onChange={(e) => setForm({ ...form, day_of_month: Number(e.target.value) })}
                    className="notion-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-warm-gray-500 mb-1">分类</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setForm({ ...form, category: cat })}
                      className={`px-3 py-1 rounded-pill text-xs font-semibold transition ${
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
                <label className="block text-xs font-medium text-warm-gray-500 mb-1">扣款人</label>
                <div className="flex gap-3">
                  {['Wendy', 'Daniel'].map((p) => (
                    <label key={p} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
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
                  id="sub-personal"
                  type="checkbox"
                  checked={form.is_personal}
                  onChange={(e) => setForm({ ...form, is_personal: e.target.checked })}
                  className="accent-notion-blue w-4 h-4"
                />
                <label htmlFor="sub-personal" className="text-sm text-notion-black cursor-pointer">
                  个人订阅
                </label>
              </div>

              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 notion-btn-ghost">
                  取消
                </button>
                <button type="submit" className="flex-1 notion-btn-primary">
                  {editing ? '保存' : '添加'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
