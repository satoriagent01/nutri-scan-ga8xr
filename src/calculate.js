/**
 * Nutrition calculation module
 * Calculates total nutrition for a meal based on products and quantities.
 */

/**
 * Round a number to a fixed number of decimal places without floating-point issues.
 * @param {number} num - The number to round
 * @param {number} decimals - Number of decimal places
 * @returns {number} The rounded number
 */
function roundTo(num, decimals) {
  if (num === 0) return 0;
  const factor = Math.pow(10, decimals);
  // Use toFixed to avoid floating-point representation issues, then parse back
  return parseFloat(Number(num).toFixed(decimals));
}

/**
 * Calculate total nutrition for a meal.
 * @param {Object} meal - The meal object with products array
 * @param {Object} meal.products - Array of { product, quantity }
 * @returns {Promise<Object>} Total nutrition: { calories, protein, carbs, fat }
 */
export async function calculateMealTotals(meal) {
  const totals = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  };

  for (const item of meal.products) {
    const { product, quantity } = item;
    const qty = quantity || 1;
    totals.calories += (product.calories || 0) * qty;
    totals.protein += (product.protein || 0) * qty;
    totals.carbs += (product.carbs || 0) * qty;
    totals.fat += (product.fat || 0) * qty;
  }

  // Round to 1 decimal place to avoid floating-point precision issues
  return {
    calories: roundTo(totals.calories, 1),
    protein: roundTo(totals.protein, 1),
    carbs: roundTo(totals.carbs, 1),
    fat: roundTo(totals.fat, 1),
  };
}