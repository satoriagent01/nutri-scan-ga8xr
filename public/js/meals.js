/**
 * Meal planning module - handles creating meals, adding products, and calculating totals.
 */

import { getAllProducts } from '../src/products.js';
import { calculateMealTotals } from '../src/calculate.js';

// In-memory store for meals (simulates backend)
const mealsStore = {};

/**
 * Create a new meal.
 * @param {string} mealName - Name of the meal.
 * @returns {Promise<Object>} The created meal object.
 */
export async function createMeal(mealName) {
  const id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9);
  const meal = {
    id,
    name: mealName,
    date: new Date().toISOString().split('T')[0],
    products: []
  };
  mealsStore[id] = meal;
  return meal;
}

/**
 * Get all meals.
 * @returns {Promise<Array>} Array of meal objects.
 */
export async function getAllMeals() {
  return Object.values(mealsStore);
}

/**
 * Get a single meal by ID.
 * @param {string} mealId - The meal ID.
 * @returns {Promise<Object|null>} The meal object or null.
 */
export async function getMeal(mealId) {
  return mealsStore[mealId] || null;
}

/**
 * Add a product to a meal with a gram amount.
 * @param {string} mealId - The meal ID.
 * @param {string} productId - The product ID.
 * @param {number} grams - Grams of the product to add.
 * @returns {Promise<Object>} The added product entry with calculated nutrition.
 */
export async function addProductToMeal(mealId, productId, grams) {
  const meal = mealsStore[mealId];
  if (!meal) {
    throw new Error('Meal not found');
  }

  const products = await getAllProducts();
  const product = products.find(p => p.id === productId);
  if (!product) {
    throw new Error('Product not found');
  }

  // Calculate nutrition for this gram amount
  const nutrition = {
    energia_kj: roundTo((product.energia_kj || 0) * grams / 100, 1),
    energia_kcal: roundTo((product.energia_kcal || 0) * grams / 100, 1),
    grasa: roundTo((product.grasa || 0) * grams / 100, 1),
    grasa_saturada: roundTo((product.grasa_saturada || 0) * grams / 100, 1),
    carbohidratos: roundTo((product.carbohidratos || 0) * grams / 100, 1),
    azucares: roundTo((product.azucares || 0) * grams / 100, 1),
    proteina: roundTo((product.proteina || 0) * grams / 100, 1),
    sal: roundTo((product.sal || 0) * grams / 100, 2),
  };

  const entry = {
    productId,
    productName: product.nombre,
    grams,
    nutrition
  };

  meal.products.push(entry);
  return entry;
}

/**
 * Remove a product entry from a meal.
 * @param {string} mealId - The meal ID.
 * @param {number} index - The index of the product entry to remove.
 */
export async function removeProductFromMeal(mealId, index) {
  const meal = mealsStore[mealId];
  if (!meal) {
    throw new Error('Meal not found');
  }
  meal.products.splice(index, 1);
}

/**
 * Delete a meal.
 * @param {string} mealId - The meal ID.
 */
export async function deleteMeal(mealId) {
  delete mealsStore[mealId];
}

/**
 * Calculate total nutrition for a meal.
 * @param {string} mealId - The meal ID.
 * @returns {Promise<Object>} Total nutrition values.
 */
export async function calculateMealTotals(mealId) {
  const meal = mealsStore[mealId];
  if (!meal) {
    throw new Error('Meal not found');
  }
  return calculateMealTotalsInternal(meal);
}

/**
 * Internal calculation function.
 * @param {Object} meal - The meal object.
 * @returns {Object} Total nutrition.
 */
function calculateMealTotalsInternal(meal) {
  const totals = {
    energia_kj: 0,
    energia_kcal: 0,
    grasa: 0,
    grasa_saturada: 0,
    carbohidratos: 0,
    azucares: 0,
    proteina: 0,
    sal: 0,
  };

  for (const entry of meal.products) {
    const n = entry.nutrition;
    totals.energia_kj = roundTo(totals.energia_kj + (n.energia_kj || 0), 1);
    totals.energia_kcal = roundTo(totals.energia_kcal + (n.energia_kcal || 0), 1);
    totals.grasa = roundTo(totals.grasa + (n.grasa || 0), 1);
    totals.grasa_saturada = roundTo(totals.grasa_saturada + (n.grasa_saturada || 0), 1);
    totals.carbohidratos = roundTo(totals.carbohidratos + (n.carbohidratos || 0), 1);
    totals.azucares = roundTo(totals.azucares + (n.azucares || 0), 1);
    totals.proteina = roundTo(totals.proteina + (n.proteina || 0), 1);
    totals.sal = roundTo(totals.sal + (n.sal || 0), 2);
  }

  return totals;
}

/**
 * Round a number to fixed decimal places.
 */
function roundTo(num, decimals) {
  if (num === 0) return 0;
  const factor = Math.pow(10, decimals);
  return parseFloat(Number(num).toFixed(decimals));
}

/**
 * Clear all meals (for testing).
 */
export function clearMeals() {
  Object.keys(mealsStore).forEach(key => delete mealsStore[key]);
}