import React, { useState } from 'react';
import Button from '../../components/common/Button.jsx';
import Table from '../../components/common/Table.jsx';
import Modal from '../../components/common/Modal.jsx';
import { Shield, Edit, Trash2, UserCheck, UserX } from 'lucide-react';

const Roles = () => {
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: 'Admin',
      description: 'Full system access',
      permissions: ['read', 'write', 'delete', 'manage_users'],
      userCount: 3
    },
    {
      id: 2,
      name: 'Manager',
      description: 'Manage leads and reports',
      permissions: ['read', 'write', 'manage_leads'],
      userCount: 8
    },
    {
      id: 3,
      name: 'Agent',
      description: 'Basic lead management',
      permissions: ['read', 'write'],
      userCount: 15
    }
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const handleAddRole = () => {
    setEditingRole(null);
    setShowAddModal(true);
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    setShowAddModal(true);
  };

  const handleDeleteRole = (roleId) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      setRoles(roles.filter(role => role.id !== roleId));
    }
  };

  const permissionLabels = {
    read: 'Read',
    write: 'Write',
    delete: 'Delete',
    manage_users: 'Manage Users',
    manage_leads: 'Manage Leads'
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Role Management</h1>
        <Button variant="primary" icon={Shield} onClick={handleAddRole}>
          Add Role
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table
          columns={[
            { key: 'name', label: 'Role Name' },
            { key: 'description', label: 'Description' },
            { key: 'permissions', label: 'Permissions', render: (val) => (
              <div className="flex flex-wrap gap-1">
                {val.map(perm => (
                  <span key={perm} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {permissionLabels[perm]}
                  </span>
                ))}
              </div>
            )},
            { key: 'userCount', label: 'Users', render: (val) => (
              <span className="flex items-center">
                <UserCheck className="w-4 h-4 mr-1" />
                {val}
              </span>
            )},
            { key: 'actions', label: 'Actions', render: (_, row) => (
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditRole(row)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteRole(row.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          ]}
          data={roles}
        />
      </div>

      <RoleModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        role={editingRole}
        onSave={(roleData) => {
          if (editingRole) {
            setRoles(roles.map(role => role.id === editingRole.id ? { ...role, ...roleData } : role));
          } else {
            setRoles([...roles, { ...roleData, id: Date.now() }]);
          }
          setShowAddModal(false);
        }}
      />
    </div>
  );
};

const RoleModal = ({ isOpen, onClose, role, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: []
  });

  const availablePermissions = [
    { id: 'read', label: 'Read Access' },
    { id: 'write', label: 'Write Access' },
    { id: 'delete', label: 'Delete Access' },
    { id: 'manage_users', label: 'Manage Users' },
    { id: 'manage_leads', label: 'Manage Leads' }
  ];

  React.useEffect(() => {
    if (role) {
      setFormData(role);
    } else {
      setFormData({ name: '', description: '', permissions: [] });
    }
  }, [role]);

  const handlePermissionChange = (permissionId) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={role ? 'Edit Role' : 'Add New Role'}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Permissions</label>
            <div className="space-y-2">
              {availablePermissions.map(perm => (
                <label key={perm.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.permissions.includes(perm.id)}
                    onChange={() => handlePermissionChange(perm.id)}
                    className="mr-2"
                  />
                  {perm.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" className="flex-1">
            {role ? 'Update' : 'Add'} Role
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default Roles;
