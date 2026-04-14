const API_BASE = '';

async function fetchJSON(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || res.statusText);
  }
  return res.json();
}

export const api = {
  getSummary: (start, end) => fetchJSON(`/api/summary?start_date=${start}&end_date=${end}`),
  getExpenses: (start, end) => fetchJSON(`/api/expenses?start_date=${start}&end_date=${end}`),
  addExpense: (data) => fetchJSON('/api/expenses', { method: 'POST', body: JSON.stringify(data) }),
  updateExpense: (id, data) => fetchJSON(`/api/expenses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteExpense: (id) => fetchJSON(`/api/expenses/${id}`, { method: 'DELETE' }),
  
  getSubscriptions: () => fetchJSON('/api/subscriptions'),
  addSubscription: (data) => fetchJSON('/api/subscriptions', { method: 'POST', body: JSON.stringify(data) }),
  updateSubscription: (id, data) => fetchJSON(`/api/subscriptions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSubscription: (id) => fetchJSON(`/api/subscriptions/${id}`, { method: 'DELETE' }),
  
  parseVoice: (text) => fetchJSON('/api/parse-voice', { method: 'POST', body: JSON.stringify({ text }) }),
  
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/api/upload`, { method: 'POST', body: formData });
    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  },
};
