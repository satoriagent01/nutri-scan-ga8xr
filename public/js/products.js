/**
 * Product management module for the frontend.
 * Handles saving products from OCR results and listing saved products.
 */

// In-memory product store (mirrors src/products.js behavior)
let products = [];

/**
 * Save a product from OCR-extracted data.
 * Maps OCR keys to the product storage format.
 * @param {Object} ocrData - Extracted nutrition data from OCR
 * @param {string} productName - User-provided product name
 * @returns {Object} The saved product object
 */
export function saveProduct(ocrData, productName) {
  const product = {
    id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9),
    nombre: productName,
    energia_kj: ocrData.calories_kj || 0,
    energia_kcal: ocrData.calories || 0,
    grasa: ocrData.totalFat || 0,
    grasa_saturada: ocrData.saturatedFat || 0,
    carbohidratos: ocrData.totalCarbohydrate || 0,
    azucares: ocrData.totalSugars || 0,
    proteina: ocrData.protein || 0,
    sal: ocrData.sodium || 0,
  };
  products.push(product);
  return product;
}

/**
 * Get all saved products.
 * @returns {Array} Array of product objects
 */
export function getAllProducts() {
  return [...products];
}

/**
 * Get a single product by ID.
 * @param {string} id - Product ID
 * @returns {Object|null} Product object or null
 */
export function getProductById(id) {
  return products.find(p => p.id === id) || null;
}

/**
 * Clear all products (for testing).
 */
export function clearProducts() {
  products = [];
}

/**
 * Render the products list in the UI.
 * @param {HTMLElement} container - Container element to render into
 */
export function renderProductsList(container) {
  container.innerHTML = '';
  const productList = getAllProducts();

  if (productList.length === 0) {
    container.innerHTML = '<p class="empty-message">No hay productos guardados. Escanea una etiqueta para agregar uno.</p>';
    return;
  }

  const list = document.createElement('ul');
  list.className = 'product-list';

  productList.forEach(product => {
    const li = document.createElement('li');
    li.className = 'product-item';

    li.innerHTML = `
      <div class="product-info">
        <h3>${product.nombre}</h3>
        <div class="nutrition-summary">
          <span>${product.energia_kcal} kcal</span>
          <span>Grasa: ${product.grasa}g</span>
          <span>Carbs: ${product.carbohidratos}g</span>
          <span>Proteína: ${product.proteina}g</span>
        </div>
      </div>
      <button class="btn btn-small btn-add-meal" data-id="${product.id}">
        Añadir a comida
      </button>
    `;

    list.appendChild(li);
  });

  container.appendChild(list);

  // Add event listeners
  container.querySelectorAll('.btn-add-meal').forEach(btn => {
    btn.addEventListener('click', () => {
      const productId = btn.dataset.id;
      const product = getProductById(productId);
      if (product) {
        showAddToMealModal(product);
      }
    });
  });
}

/**
 * Show a modal to add a product to a meal.
 * @param {Object} product - The product to add
 */
function showAddToMealModal(product) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <h3>Añadir "${product.nombre}" a una comida</h3>
      <form id="add-to-meal-form">
        <label for="meal-select">Comida:</label>
        <select id="meal-select" required>
          <option value="">-- Selecciona una comida --</option>
        </select>
        <label for="grams-input">Gramos:</label>
        <input type="number" id="grams-input" min="1" value="100" required>
        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" id="cancel-add">Cancelar</button>
          <button type="submit" class="btn btn-primary">Añadir</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(overlay);

  // Populate meal select
  const mealSelect = overlay.querySelector('#meal-select');
  const meals = JSON.parse(localStorage.getItem('nutriscan_meals') || '[]');
  meals.forEach(meal => {
    const option = document.createElement('option');
    option.value = meal.id;
    option.textContent = meal.name;
    mealSelect.appendChild(option);
  });

  // Cancel button
  overlay.querySelector('#cancel-add').addEventListener('click', () => {
    document.body.removeChild(overlay);
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      document.body.removeChild(overlay);
    }
  });

  // Form submit
  overlay.querySelector('#add-to-meal-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const mealId = mealSelect.value;
    const grams = parseInt(overlay.querySelector('#grams-input').value, 10);

    if (mealId && grams > 0) {
      addProductToMeal(mealId, product, grams);
      document.body.removeChild(overlay);
    }
  });
}

/**
 * Add a product to a meal.
 * @param {string} mealId - Meal ID
 * @param {Object} product - Product object
 * @param {number} grams - Grams to add
 */
function addProductToMeal(mealId, product, grams) {
  const meals = JSON.parse(localStorage.getItem('nutriscan_meals') || '[]');
  const mealIndex = meals.findIndex(m => m.id === mealId);

  if (mealIndex === -1) {
    alert('Comida no encontrada');
    return;
  }

  const meal = meals[mealIndex];

  // Check if product already exists in meal
  const existingIndex = meal.products.findIndex(
    item => item.product.id === product.id
  );

  if (existingIndex >= 0) {
    meal.products[existingIndex].grams += grams;
  } else {
    meal.products.push({
      product: { ...product },
      grams: grams
    });
  }

  meals[mealIndex] = meal;
  localStorage.setItem('nutriscan_meals', JSON.stringify(meals));

  // Refresh meals view if on meals screen
  const mealsContainer = document.getElementById('meals-list');
  if (mealsContainer) {
    import('./meals.js').then(module => {
      module.renderMealsList(mealsContainer);
    });
  }

  alert('Producto añadido a la comida');
}