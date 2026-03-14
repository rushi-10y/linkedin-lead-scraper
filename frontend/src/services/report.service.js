import api from './api.js';

class ReportService {
  async getDashboardStats() {
    return api.get('/reports/dashboard');
  }

  async getLeadConversionReport(filters = {}) {
    const qs = new URLSearchParams(filters).toString();
    return api.get(`/reports/leads/conversion?${qs}`);
  }

  async getSourcePerformanceReport(filters = {}) {
    const qs = new URLSearchParams(filters).toString();
    return api.get(`/reports/sources/performance?${qs}`);
  }

  async getUserActivityReport(filters = {}) {
    const qs = new URLSearchParams(filters).toString();
    return api.get(`/reports/users/activity?${qs}`);
  }

  async generateCustomReport(config) {
    return api.post('/reports/custom', config);
  }

  async getReportHistory() {
    return api.get('/reports/history');
  }

  async downloadReport(reportId, format = 'pdf') {
    return api.download(`/reports/${reportId}/download?format=${format}`);
  }

  async scheduleReport(config) {
    return api.post('/reports/schedule', config);
  }

  async getScheduledReports() {
    return api.get('/reports/scheduled');
  }
}

export default new ReportService();
