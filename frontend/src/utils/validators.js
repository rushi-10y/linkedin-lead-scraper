const validateEmail = (email = '') => {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).trim());
};

const validatePhone = (phone = '') => {
  if (!phone) return true; // optional field
  const digits = String(phone).replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
};

const validateRequired = (value) => {
  if (value === null || value === undefined) return false;
  return String(value).trim().length > 0;
};

const validateMinLength = (value, minLength = 0) => {
  if (!value) return false;
  return String(value).length >= minLength;
};

export {
  validateEmail,
  validatePhone,
  validateRequired,
  validateMinLength
};
