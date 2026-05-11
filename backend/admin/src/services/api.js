import axios from 'axios'

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, ''),
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      window.location.href = '/admin/login'
    }
    return Promise.reject(error)
  }
)

export const leadsApi = {
  getAll: () => api.get('/leads'),
  create: (data) => api.post('/leads', data),
  update: (id, data) => api.put(`/leads/${id}`, data),
  delete: (id) => api.delete(`/leads/${id}`),
}

export const scrapeApi = {
  scrapeKeywords: (data) => api.post('/scrape', data),
}

export default api

