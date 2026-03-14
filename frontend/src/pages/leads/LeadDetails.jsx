import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLeads } from '../../context/LeadContext.jsx';
import { formatDate, formatCurrency } from '../../utils/formatters.js';
import Button from '../../components/common/Button.jsx';
import Select from '../../components/common/Select.jsx';
import Modal from '../../components/common/Modal.jsx';
import Loader from '../../components/common/Loader.jsx';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { leads, loading, updateLead, deleteLead } = useLeads();

  const [showDelete, setShowDelete] = useState(false);

  if (loading) {
    return <Loader />;
  }

  const lead = leads.find(l => String(l.id) === String(id));

  if (!lead) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Lead Not Found</h2>
        <p className="text-gray-600 mb-4">
          The lead you’re looking for doesn’t exist.
        </p>
        <Button variant="primary" onClick={() => navigate('/leads')}>
          Back to Leads
        </Button>
      </div>
    );
  }

  const handleDelete = () => {
    deleteLead(lead.id);
    navigate('/leads', { replace: true });
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            icon={ArrowLeft}
            onClick={() => navigate('/leads')}
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold">{lead.name}</h1>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" icon={Edit}>
            Edit
          </Button>
          <Button
            variant="danger"
            icon={Trash2}
            onClick={() => setShowDelete(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lead Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">
            Lead Information
          </h2>

          <Detail label="Email" value={lead.email} />
          <Detail label="Company" value={lead.company || '—'} />
          <Detail label="Value" value={formatCurrency(lead.value)} />
          <Detail label="Source" value={lead.source} />
          <Detail label="Created" value={formatDate(lead.createdAt)} />
        </div>

        {/* Status & Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">
            Status & Actions
          </h2>

          <Select
            label="Status"
            value={lead.status}
            onChange={(e) =>
              updateLead(lead.id, { status: e.target.value })
            }
            options={[
              { value: 'new', label: 'New' },
              { value: 'contacted', label: 'Contacted' },
              { value: 'qualified', label: 'Qualified' },
              { value: 'converted', label: 'Converted' },
              { value: 'closed', label: 'Closed' }
            ]}
          />

          <div className="pt-4 border-t mt-4 space-y-2">
            <Button variant="secondary" className="w-full justify-start">
              Send Email
            </Button>
            <Button variant="secondary" className="w-full justify-start">
              Schedule Call
            </Button>
            <Button variant="secondary" className="w-full justify-start">
              Add Note
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <Modal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        title="Delete Lead"
      >
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete this lead? This action
          cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => setShowDelete(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>
    </>
  );
};

const Detail = ({ label, value }) => (
  <div className="mb-3">
    <label className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <p className="text-sm text-gray-900 mt-1">
      {value}
    </p>
  </div>
);

export default LeadDetails;
