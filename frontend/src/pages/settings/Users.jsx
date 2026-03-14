import React, { useState } from 'react';
import Button from '../../components/common/Button.jsx';
import Table from '../../components/common/Table.jsx';
import Modal from '../../components/common/Modal.jsx';
import Select from '../../components/common/Select.jsx';
import { UserPlus, Edit, Trash2, Mail, Phone } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active', lastLogin: '2025-01-20' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'manager', status: 'active', lastLogin: '2025-01-19' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'agent', status: 'inactive', lastLogin: '2025-01-15' }
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const handleAddUser = () => {
    setEditingUser(null);
    setShowAddModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowAddModal(true);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button variant="primary" icon={UserPlus} onClick={handleAddUser}>
          Add User
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'role', label: 'Role', render: (val) => (
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                val === 'admin' ? 'bg-red-100 text-red-800' :
                val === 'manager' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {val.toUpperCase()}
              </span>
            )},
            { key: 'status', label: 'Status', render: (val) => (
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                val === 'active' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {val.toUpperCase()}
              </span>
            )},
            { key: 'lastLogin', label: 'Last Login' },
            { key: 'actions', label: 'Actions', render: (_, row) => (
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditUser(row)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteUser(row.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          ]}
          data={users}
        />
      </div>

      <UserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        user={editingUser}
        onSave={(userData) => {
          if (editingUser) {
            setUsers(users.map(user => user.id === editingUser.id ? { ...user, ...userData } : user));
          } else {
            setUsers([...users, { ...userData, id: Date.now() }]);
          }
          setShowAddModal(false);
        }}
      />
    </div>
  );
};

const UserModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'agent',
    status: 'active'
  });

  React.useEffect(() => {
    if (user) {
      setFormData(user);
    } else {
      setFormData({ name: '', email: '', role: 'agent', status: 'active' });
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={user ? 'Edit User' : 'Add New User'}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <Select
            label="Role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            options={[
              { value: 'admin', label: 'Admin' },
              { value: 'manager', label: 'Manager' },
              { value: 'agent', label: 'Agent' }
            ]}
          />

          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' }
            ]}
          />
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" className="flex-1">
            {user ? 'Update' : 'Add'} User
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default Users;
