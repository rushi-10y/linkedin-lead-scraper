import api from './apiService';

class ScrapeService {
  async startScraping(type, params) {
    return api.post('/scraping/start', {
      type,
      params
    });
  }

  async getScrapingStatus(jobId) {
    return api.get(`/scraping/${jobId}/status`);
  }

  async getScrapingResults(jobId) {
    return api.get(`/scraping/${jobId}/results`);
  }

  async getScrapingHistory(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/scraping/history${qs ? `?${qs}` : ''}`);
  }

  async cancelScraping(jobId) {
    return api.post(`/scraping/${jobId}/cancel`);
  }
}

export default new ScrapeService();
