import { randomUUID } from "node:crypto";

/**
 * Creates a new meal with a unique ID.
 * @param {Object} meals - The meals store (object keyed by meal ID).
 * @param {Object} mealData - The meal data { name, date }.
 * @returns {Promise<{ success: boolean, meal: { id: string, name: string, date: string, products: Array } }>}
 */
export async function createMeal(meals, mealData) {
  const id = randomUUID();
  const meal = {
    id,
    name: mealData.name,
    date: mealData.date,
    products: []
  };
  meals[id] = meal;
  return { success: true, meal };
}

/**
 * Adds a product to a meal.
 * @param {Object} meals - The meals store (object keyed by meal ID).
 * @param {string} mealId - The ID of the meal.
 * @param {string} productId - The ID of the product.
 * @param {number} grams - The amount in grams.
 * @returns {Promise<{ success: boolean, message?: string }>}
 */
export async function addProductToMeal(meals, mealId, productId, grams) {
  const meal = meals[mealId];
  if (!meal) {
    return { success: false, message: "Meal not found" };
  }
  meal.products.push({ productId, grams });
  return { success: true };
}

/**
 * Gets all meals.
 * @param {Object} meals - The meals store (object keyed by meal ID).
 * @returns {Promise<Array>}
 */
export async function getAllMeals(meals) {
  return Object.values(meals);
}

/**
 * Gets a single meal by ID.
 * @param {Object} meals - The meals store (object keyed by meal ID).
 * @param {string} mealId - The ID of the meal.
 * @returns {Promise<Object|null>}
 */
export async function getMeal(meals, mealId) {
  return meals[mealId] || null;
}