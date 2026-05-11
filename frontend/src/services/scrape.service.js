import api from './api.js';

class ScrapeService {
  async startScraping(type, params) {
    return api.post('/scrape', {
      source: type,
      ...params
    });
  }

  async getScrapingStatus(jobId) {
    return api.get(`/scrape/${jobId}/status`);
  }

  async getScrapingResults(jobId) {
    return api.get(`/scrape/${jobId}/results`);
  }

  async getScrapingHistory(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/scrape/history${qs ? `?${qs}` : ''}`);
  }

  async cancelScraping(jobId) {
    return api.post(`/scrape/${jobId}/cancel`);
  }
}

export default new ScrapeService();
