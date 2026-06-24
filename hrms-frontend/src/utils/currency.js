/**
 * Format amount as Philippine Peso (₱)
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Currency configuration for the application
 */
export const CURRENCY = {
  code: 'PHP',
  symbol: '₱',
  locale: 'en-PH',
  name: 'Philippine Peso',
};
