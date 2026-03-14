import axios from 'axios';\n\nconst api = axios.create({\n  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',\n});\n\nexport default api;
