/**
 * Nutrition calculation module
 * Calculates total nutrition for a meal based on products and quantities.
 */

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

  return totals;
}