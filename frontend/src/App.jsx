import React, { useState, useEffect } from 'react';
import { api } from './api';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import RecordPage from './pages/RecordPage';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import AddExpenseModal from './components/AddExpenseModal';
import SubscriptionManager from './components/SubscriptionManager';

function App() {
  const today = new Date().toISOString().split('T')[0];
  const firstDayOfMonth = new Date().toISOString().slice(0, 8) + '01';

  const [currentTab, setCurrentTab] = useState('record');

  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(today);
  const [summary, setSummary] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [defaultPayer, setDefaultPayer] = useState('Wendy');

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sumRes, expRes] = await Promise.all([
        api.getSummary(startDate, endDate),
        api.getExpenses(startDate, endDate),
      ]);
      setSummary(sumRes);
      setExpenses(expRes);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRangeChange = ({ start, end }) => {
    if (start !== undefined) setStartDate(start);
    if (end !== undefined) setEndDate(end);
  };

  const handleSave = async (form) => {
    try {
      if (editingItem) {
        await api.updateExpense(editingItem.id, form);
      } else {
        await api.addExpense(form);
      }
      setShowAddModal(false);
      setEditingItem(null);
      fetchData();
    } catch (e) {
      alert('保存失败');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('确定删除这条记录吗？')) return;
    try {
      await api.deleteExpense(id);
      fetchData();
    } catch (e) {
      alert('删除失败');
    }
  };

  const handleVoiceResult = (result) => {
    const prefill = {
      type: 'expense',
      amount: result.amount || '',
      category: result.category || '其他',
      payer: result.payer || defaultPayer,
      is_personal: !!result.is_personal,
      note: result.note || result.rawText || '',
      date: new Date().toISOString().split('T')[0],
      receipt_image: '',
    };
    setEditingItem(null);
    if (prefill.amount && prefill.payer) {
      api.addExpense(prefill).then(() => {
        fetchData();
      }).catch(() => {
        setShowAddModal(true);
      });
    } else {
      setShowAddModal(true);
    }
  };

  const openAdd = (payer) => {
    setDefaultPayer(payer);
    setEditingItem(null);
    setShowAddModal(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setShowAddModal(true);
  };

  return (
    <div className="min-h-screen bg-white pb-28">
      <Header />

      <main className="pt-2">
        {currentTab === 'record' && (
          <RecordPage
            onOpenAdd={openAdd}
            onOpenSub={() => setShowSubModal(true)}
            onVoiceResult={handleVoiceResult}
            defaultPayer={defaultPayer}
          />
        )}
        {currentTab === 'home' && (
          <HomePage
            startDate={startDate}
            endDate={endDate}
            onChangeRange={handleRangeChange}
            summary={summary}
          />
        )}
        {currentTab === 'detail' && (
          <DetailPage
            startDate={startDate}
            endDate={endDate}
            onChangeRange={handleRangeChange}
            expenses={expenses}
            onEdit={openEdit}
            onDelete={handleDelete}
            onRefresh={fetchData}
          />
        )}
      </main>

      <BottomNav current={currentTab} onChange={setCurrentTab} />

      <AddExpenseModal
        isOpen={showAddModal}
        onClose={() => { setShowAddModal(false); setEditingItem(null); }}
        onSave={handleSave}
        initialData={editingItem}
        defaultPayer={defaultPayer}
      />

      <SubscriptionManager
        isOpen={showSubModal}
        onClose={() => { setShowSubModal(false); fetchData(); }}
      />
    </div>
  );
}

export default App;
