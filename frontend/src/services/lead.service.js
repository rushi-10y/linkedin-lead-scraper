import api from './apiService';

class LeadService {
  async getLeads(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      return await api.get(`/leads${query ? `?${query}` : ''}`);
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch leads');
    }
  }

  async createLead(data) {
    try {
      return await api.post('/leads', data);
    } catch (error) {
      throw new Error(error.message || 'Failed to create lead');
    }
  }

  async updateLead(id, data) {
    try {
      return await api.put(`/leads/${id}`, data);
    } catch (error) {
      throw new Error(error.message || 'Failed to update lead');
    }
  }

  async deleteLead(id) {
    try {
      return await api.delete(`/leads/${id}`);
    } catch (error) {
      throw new Error(error.message || 'Failed to delete lead');
    }
  }

  async importLeads(file, options = {}) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      Object.entries(options).forEach(([key, value]) =>
        formData.append(key, value)
      );

      return await api.request('/leads/import', {
        method: 'POST',
        body: formData,
        headers: {} // Let browser set multipart boundary
      });
    } catch (error) {
      throw new Error(error.message || 'Failed to import leads');
    }
  }

  async exportLeads(filters = {}) {
    try {
      const query = new URLSearchParams(filters).toString();
      return await api.get(`/leads/export?${query}`);
    } catch (error) {
      throw new Error(error.message || 'Failed to export leads');
    }
  }
}

export default new LeadService();
