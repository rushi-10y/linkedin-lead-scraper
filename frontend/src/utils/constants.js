// constants.js

export const ROLES = Object.freeze({
  ADMIN: 'admin',
  MANAGER: 'manager',
  AGENT: 'agent'
});

export const LEAD_STATUS = Object.freeze({
  NEW: 'new',
  CONTACTED: 'contacted',
  QUALIFIED: 'qualified',
  CONVERTED: 'converted',
  CLOSED: 'closed'
});

// validators.js

export const validateEmail = (email = '') => {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
};

export const validatePhone = (phone = '') => {
  if (!phone) return true; // optional field
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15;
};

// formatters.js

export const formatDate = (date) => {
  if (!date) return 'N/A';

  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) return 'Invalid Date';

  return parsedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatCurrency = (amount = 0, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0
  }).format(Number(amount) || 0);
};
