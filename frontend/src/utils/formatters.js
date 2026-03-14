const formatDate = (date) => {
  if (!date) return 'N/A';

  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) return 'Invalid Date';

  return parsedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatCurrency = (amount = 0, currency = 'USD') => {
  const value = Number(amount);
  if (isNaN(value)) return '$0';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(value);
};

export { formatDate, formatCurrency };
