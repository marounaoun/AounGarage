// 📁 src/pages/PoliciesPage.jsx
import React, { useEffect, useState } from 'react';
import api from '../api'; // ✅ using the configured axios instance

function PoliciesPage() {
  const [policies, setPolicies] = useState([]);
  const [clients, setClients] = useState([]);
  const [newPolicy, setNewPolicy] = useState({
    client_id: '',
    type: '',
    insurer: '',
    policy_number: '',
    start_date: '',
    renewal_date: '',
    status: '',
    premium_amount: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPolicies();
    fetchClients();
  }, []);

  const fetchPolicies = () => {
    api.get('/policies') // ✅ no more hardcoded localhost
      .then(res => setPolicies(res.data))
      .catch(() => setError('Failed to load policies'));
  };

  const fetchClients = () => {
    api.get('/clients') // ✅ same here
      .then(res => setClients(res.data))
      .catch(() => setError('Failed to load clients'));
  };

  const handleChange = (e) => {
    setNewPolicy({ ...newPolicy, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      if (editingId) {
        await api.put(`/policies/${editingId}`, newPolicy);
        setMessage('Policy updated successfully!');
      } else {
        await api.post('/policies', newPolicy);
        setMessage('Policy added successfully!');
      }

      setNewPolicy({
        client_id: '',
        type: '',
        insurer: '',
        policy_number: '',
        start_date: '',
        renewal_date: '',
        status: '',
        premium_amount: '',
      });
      setEditingId(null);
      fetchPolicies();
    } catch (err) {
      setError('Failed to save policy');
    }
  };

  const handleEdit = (policy) => {
    setEditingId(policy.id);
    setNewPolicy({ ...policy });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this policy?')) {
      try {
        await api.delete(`/policies/${id}`);
        setMessage('Policy deleted');
        fetchPolicies();
      } catch {
        setError('Error deleting policy');
      }
    }
  };

  const getClientName = (id) => {
    const client = clients.find(c => c.id === id);
    return client ? client.full_name : 'Unknown';
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Policies</h1>

      {message && <div className="bg-green-100 text-green-800 p-2 mb-2 rounded">{message}</div>}
      {error && <div className="bg-red-100 text-red-800 p-2 mb-2 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <select
          name="client_id"
          value={newPolicy.client_id}
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
        <input type="text" name="type" placeholder="Policy Type" value={newPolicy.type} onChange={handleChange} className="border p-2 w-full" required />
        <input type="text" name="insurer" placeholder="Insurer" value={newPolicy.insurer} onChange={handleChange} className="border p-2 w-full" required />
        <input type="text" name="policy_number" placeholder="Policy Number" value={newPolicy.policy_number} onChange={handleChange} className="border p-2 w-full" required />
        <input type="date" name="start_date" value={newPolicy.start_date} onChange={handleChange} className="border p-2 w-full" required />
        <input type="date" name="renewal_date" value={newPolicy.renewal_date} onChange={handleChange} className="border p-2 w-full" required />
        <input type="text" name="status" placeholder="Status" value={newPolicy.status} onChange={handleChange} className="border p-2 w-full" required />
        <input type="number" name="premium_amount" placeholder="Premium Amount" value={newPolicy.premium_amount} onChange={handleChange} className="border p-2 w-full" required />
        
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editingId ? 'Update Policy' : 'Add Policy'}
        </button>
      </form>

      <ul>
        {policies.map(policy => (
          <li key={policy.id} className="mb-2 p-2 border rounded flex justify-between items-center">
            <div>
              <strong>{getClientName(policy.client_id)}</strong> – {policy.policy_number} – Renewal: {policy.renewal_date}
            </div>
            <div className="space-x-2">
              <button onClick={() => handleEdit(policy)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
              <button onClick={() => handleDelete(policy.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PoliciesPage;
