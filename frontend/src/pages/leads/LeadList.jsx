import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeads } from '../../context/LeadContext.jsx';
import Button from '../../components/common/Button.jsx';
import Table from '../../components/common/Table.jsx';
import Loader from '../../components/common/Loader.jsx';
import Modal from '../../components/common/Modal.jsx';
import AddLeadModal from './AddLead.jsx';
import { Filter, Download, Plus, Eye, Edit, Trash2 } from 'lucide-react';

const LeadList = () => {
  const navigate = useNavigate();
  const { leads, loading, fetchLeads, deleteLead } = useLeads();

  const [showAddModal, setShowAddModal] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Leads</h1>

        <div className="flex gap-3">
          <Button variant="secondary" icon={Filter}>
            Filter
          </Button>

          <Button variant="secondary" icon={Download}>
            Export
          </Button>

          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setShowAddModal(true)}
          >
            Add Lead
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'company', label: 'Company' },
            {
              key: 'value',
              label: 'Value',
              render: (val) => `$${val}`
            },
            {
              key: 'status',
              label: 'Status',
              render: (val) => (
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    val === 'new'
                      ? 'bg-blue-100 text-blue-800'
                      : val === 'contacted'
                      ? 'bg-yellow-100 text-yellow-800'
                      : val === 'qualified'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {val.toUpperCase()}
                </span>
              )
            },
            {
              key: 'actions',
              label: 'Actions',
              render: (_, row) => (
                <div className="flex gap-3">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => navigate(`/leads/${row.id}`)}
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    className="text-green-600 hover:text-green-800"
                    onClick={() => navigate(`/leads/${row.id}`)}
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => setLeadToDelete(row)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )
            }
          ]}
          data={leads}
        />
      </div>

      {/* Add Lead */}
      <AddLeadModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      {/* Delete Confirmation */}
      <Modal
        isOpen={!!leadToDelete}
        onClose={() => setLeadToDelete(null)}
        title="Delete Lead"
      >
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete{' '}
          <strong>{leadToDelete?.name}</strong>? This action
          cannot be undone.
        </p>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => setLeadToDelete(null)}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            className="flex-1"
            onClick={() => {
              deleteLead(leadToDelete.id);
              setLeadToDelete(null);
            }}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default LeadList;
