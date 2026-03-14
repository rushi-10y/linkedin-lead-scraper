import React, { useEffect, useState } from 'react';
import { useLeads } from '../../context/LeadContext.jsx';
import { validateEmail, validateRequired } from '../../utils/validators.js';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import Select from '../../components/common/Select.jsx';
import Modal from '../../components/common/Modal.jsx';

const INITIAL_STATE = {
  name: '',
  email: '',
  company: '',
  value: '',
  status: 'new'
};

const AddLeadModal = ({ isOpen, onClose }) => {
  const { addLead } = useLeads();
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setFormData(INITIAL_STATE);
      setErrors({});
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validateRequired(formData.name))
      newErrors.name = 'Name is required';

    if (!validateRequired(formData.email))
      newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email))
      newErrors.email = 'Invalid email';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      addLead({
        ...formData,
        value: Number(formData.value) || 0,
        source: 'manual'
      });

      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Lead">
      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
          disabled={loading}
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
          disabled={loading}
        />

        <Input
          label="Company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          disabled={loading}
        />

        <Input
          label="Estimated Value"
          name="value"
          type="number"
          value={formData.value}
          onChange={handleChange}
          disabled={loading}
        />

        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={[
            { value: 'new', label: 'New' },
            { value: 'contacted', label: 'Contacted' },
            { value: 'qualified', label: 'Qualified' },
            { value: 'converted', label: 'Converted' }
          ]}
          disabled={loading}
        />

        <div className="flex gap-3 mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Lead'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddLeadModal;
