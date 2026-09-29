function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substr(2, 9);
}

export async function createMeal(store, mealData) {
  const id = generateId();
  const meal = {
    id,
    name: mealData.name,
    date: mealData.date,
    products: []
  };
  store[id] = meal;
  return { success: true, meal };
}

export async function addProductToMeal(store, mealId, productId, grams) {
  if (!store[mealId]) {
    return { success: false, error: 'Meal not found' };
  }
  store[mealId].products.push({
    product: { id: productId },
    quantity: grams
  });
  return { success: true };
}

export function getMeal(store, mealId) {
  return store[mealId] || null;
}

export function getAllMeals(store) {
  return Object.values(store);
}