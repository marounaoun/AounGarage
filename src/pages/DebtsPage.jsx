// 📁 src/pages/DebtsPage.jsx
import React, { useEffect, useState } from 'react';
import api from '../api';

function DebtsPage() {
  const [debts, setDebts] = useState([]);
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    client_id: '',
    amount: '',
    reason: '',
    due_date: '',
    status: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDebts();
    fetchClients();
  }, []);

  const fetchDebts = async () => {
    try {
      const res = await api.get('/debts');
      setDebts(res.data);
    } catch {
      setError('Failed to load debts');
    }
  };

  const fetchClients = async () => {
    try {
      const res = await api.get('/clients');
      setClients(res.data);
    } catch {
      setError('Failed to load clients');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const endpoint = editingId ? `/debts/${editingId}` : '/debts';
    const method = editingId ? 'put' : 'post';

    try {
      await api[method](endpoint, formData);
      setMessage(editingId ? 'Debt updated successfully!' : 'Debt added successfully!');
      setFormData({
        client_id: '',
        amount: '',
        reason: '',
        due_date: '',
        status: '',
      });
      setEditingId(null);
      fetchDebts();
    } catch {
      setError('Failed to save debt');
    }
  };

  const handleEdit = (debt) => {
    setEditingId(debt.id);
    setFormData({
      client_id: debt.client_id,
      amount: debt.amount,
      reason: debt.reason,
      due_date: debt.due_date,
      status: debt.status,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this debt?')) {
      try {
        await api.delete(`/debts/${id}`);
        setMessage('Debt deleted');
        fetchDebts();
      } catch {
        setError('Error deleting debt');
      }
    }
  };

  const getClientName = (id) => {
    const client = clients.find(c => c.id === id);
    return client ? client.full_name : 'Unknown';
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Debts</h1>

      {message && <div className="bg-green-100 text-green-800 p-2 mb-2 rounded">{message}</div>}
      {error && <div className="bg-red-100 text-red-800 p-2 mb-2 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <select
          name="client_id"
          value={formData.client_id}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        >
          <option value="">Select Client</option>
          {clients.map(client => (
            <option key={client.id} value={client.id}>
              {client.full_name}
            </option>
          ))}
        </select>
        <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleChange} className="border p-2 w-full" required />
        <input type="text" name="reason" placeholder="Reason" value={formData.reason} onChange={handleChange} className="border p-2 w-full" required />
        <input type="date" name="due_date" value={formData.due_date} onChange={handleChange} className="border p-2 w-full" required />
        <input type="text" name="status" placeholder="Status" value={formData.status} onChange={handleChange} className="border p-2 w-full" required />

        <button type="submit" className={`text-white px-4 py-2 rounded ${editingId ? 'bg-yellow-500' : 'bg-blue-500'}`}>
          {editingId ? 'Update Debt' : 'Add Debt'}
        </button>
      </form>

      <ul>
        {debts.map(debt => (
          <li key={debt.id} className="mb-2 p-2 border rounded flex justify-between items-center">
            <div>
              <strong>{getClientName(debt.client_id)}</strong> owes <strong>${debt.amount}</strong> – {debt.reason}, due {debt.due_date}, status: {debt.status}
            </div>
            <div className="space-x-2">
              <button onClick={() => handleEdit(debt)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
              <button onClick={() => handleDelete(debt.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DebtsPage;
