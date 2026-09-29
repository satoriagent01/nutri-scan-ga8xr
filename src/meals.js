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

export async function addProductToMeal(store, mealId, product, quantity = 1) {
  if (!store[mealId]) {
    return { success: false, error: 'Meal not found' };
  }
  
  // Check if product with same id already exists
  const existingIndex = store[mealId].products.findIndex(
    item => item.product.id === product.id
  );
  
  if (existingIndex >= 0) {
    // Update quantity
    store[mealId].products[existingIndex].quantity += quantity;
  } else {
    // Add new product
    store[mealId].products.push({
      product: { ...product },
      quantity: quantity
    });
  }
  
  return { success: true, meal: store[mealId] };
}

export function getMeal(store, mealId) {
  return store[mealId] || null;
}

export function getAllMeals(store) {
  return Object.values(store);
}