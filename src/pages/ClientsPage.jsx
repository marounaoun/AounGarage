// 📁 src/pages/ClientsPage.jsx
import React, { useEffect, useState } from 'react';
import api from '../api';

function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = () => {
    api.get('/clients')
      .then(res => setClients(res.data))
      .catch(() => setError('Failed to load clients'));
  };

  const handleChange = (e) => {
    setNewClient({ ...newClient, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const { full_name, email, phone, address } = newClient;

    if (!full_name || !email || !phone || !address) {
      return setError('All fields are required.');
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return setError('Please enter a valid email.');
    }

    try {
      if (editingId) {
        await api.put(`/clients/${editingId}`, newClient);
        setMessage('Client updated!');
      } else {
        await api.post('/clients', newClient);
        setMessage('Client added successfully!');
      }

      setNewClient({ full_name: '', email: '', phone: '', address: '' });
      setEditingId(null);
      fetchClients();
    } catch {
      setError(editingId ? 'Error updating client.' : 'Error adding client.');
    }
  };

  const handleEdit = (client) => {
    setEditingId(client.id);
    setNewClient({
      full_name: client.full_name,
      email: client.email,
      phone: client.phone,
      address: client.address
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this client?')) {
      try {
        await api.delete(`/clients/${id}`);
        setMessage('Client deleted');
        fetchClients();
      } catch {
        setError('Error deleting client');
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Clients</h1>

      {/* Alerts */}
      {message && <div className="bg-green-100 text-green-800 p-2 rounded mb-2">{message}</div>}
      {error && <div className="bg-red-100 text-red-800 p-2 rounded mb-2">{error}</div>}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <input type="text" name="full_name" placeholder="Full Name" value={newClient.full_name} onChange={handleChange} className="border p-2 w-full" required />
        <input type="email" name="email" placeholder="Email" value={newClient.email} onChange={handleChange} className="border p-2 w-full" required />
        <input type="text" name="phone" placeholder="Phone" value={newClient.phone} onChange={handleChange} className="border p-2 w-full" required />
        <input type="text" name="address" placeholder="Address" value={newClient.address} onChange={handleChange} className="border p-2 w-full" required />
        <button type="submit" className={`px-4 py-2 rounded text-white ${editingId ? 'bg-yellow-500' : 'bg-blue-500'}`}>
          {editingId ? 'Update Client' : 'Add Client'}
        </button>
      </form>

      {/* Client List */}
      <ul>
        {clients.map(client => (
          <li key={client.id} className="mb-2 flex justify-between items-center p-2 border rounded">
            <span>{client.full_name} – {client.email} – {client.phone} – {client.address}</span>
            <div className="space-x-2">
              <button onClick={() => handleEdit(client)} className="bg-yellow-400 text-white px-2 py-1 rounded">Edit</button>
              <button onClick={() => handleDelete(client.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ClientsPage;
