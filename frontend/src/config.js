const config = Object.freeze({
  API_BASE_URL:
    process.env.REACT_APP_API_BASE_URL?.trim() ||
    'http://localhost:3001/api',

  APP_NAME: 'LeadScraper Pro',
  VERSION: '1.0.0',

  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100
  },

  FILE_UPLOAD: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10 MB
    SUPPORTED_FILE_TYPES: ['.csv', '.xlsx', '.xls']
  },

  SCRAPING_SOURCES: Object.freeze({
    LINKEDIN: 'linkedin',
    GOOGLE: 'google',
    COMPANY_WEBSITES: 'company_websites',
    SOCIAL_MEDIA: 'social_media'
  }),

  LEAD_STATUSES: Object.freeze({
    NEW: 'new',
    CONTACTED: 'contacted',
    QUALIFIED: 'qualified',
    CONVERTED: 'converted',
    CLOSED: 'closed'
  }),

  USER_ROLES: Object.freeze({
    ADMIN: 'admin',
    MANAGER: 'manager',
    AGENT: 'agent'
  })
});

export default config;
