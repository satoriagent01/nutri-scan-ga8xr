/**
 * OCR Upload & Display Logic
 * Handles photo upload, simulated OCR extraction, and display of extracted nutrition data.
 */

// Simulated OCR extraction — mimics what src/ocr.js would do on the backend.
// In production, this would POST the image to the configured AI endpoint.
async function simulateOcrExtraction(imageFile) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        calories: 2292,
        totalFat: 33,
        saturatedFat: 13,
        transFat: 0,
        cholesterol: 0,
        sodium: 180,
        totalCarbohydrate: 55,
        dietaryFiber: 2.4,
        totalSugars: 45,
        protein: 6.8,
        vitaminD: 0,
        calcium: 0,
        iron: 0,
        potassium: 0,
      });
    }, 1500);
  });
}

export async function handlePhotoUpload(inputElement, onExtracted) {
  const file = inputElement.files[0];
  if (!file) return;

  const preview = document.getElementById('ocr-preview');
  const previewImg = document.createElement('img');
  previewImg.src = URL.createObjectURL(file);
  previewImg.style.maxWidth = '100%';
  previewImg.style.maxHeight = '200px';
  preview.innerHTML = '';
  preview.appendChild(previewImg);

  const statusEl = document.getElementById('ocr-status');
  statusEl.textContent = 'Procesando imagen...';
  statusEl.className = 'ocr-status processing';

  try {
    const data = await simulateOcrExtraction(file);
    statusEl.textContent = '¡Datos extraídos correctamente!';
    statusEl.className = 'ocr-status success';
    onExtracted(data);
  } catch (err) {
    statusEl.textContent = 'Error al procesar la imagen.';
    statusEl.className = 'ocr-status error';
  }
}

export function displayExtractedData(data) {
  const container = document.getElementById('ocr-result');
  if (!container || !data) return;

  container.innerHTML = `
    <h3>Datos Nutricionales Extraídos (por 100g)</h3>
    <table class="nutrition-table">
      <tr><th>Nutriente</th><th>Valor</th></tr>
      <tr><td>Calorías (kcal)</td><td>${data.calories || 0}</td></tr>
      <tr><td>Calorías (kJ)</td><td>${(data.calories * 4.184).toFixed(0)}</td></tr>
      <tr><td>Grasa total (g)</td><td>${data.totalFat || 0}</td></tr>
      <tr><td>Grasa saturada (g)</td><td>${data.saturatedFat || 0}</td></tr>
      <tr><td>Carbohidratos (g)</td><td>${data.totalCarbohydrate || 0}</td></tr>
      <tr><td>Azúcares (g)</td><td>${data.totalSugars || 0}</td></tr>
      <tr><td>Proteína (g)</td><td>${data.protein || 0}</td></tr>
      <tr><td>Sodio (mg)</td><td>${data.sodium || 0}</td></tr>
      <tr><td>Fibra dietética (g)</td><td>${data.dietaryFiber || 0}</td></tr>
    </table>
  `;
}

export function clearOcrResult() {
  const container = document.getElementById('ocr-result');
  if (container) container.innerHTML = '';
  const statusEl = document.getElementById('ocr-status');
  if (statusEl) {
    statusEl.textContent = '';
    statusEl.className = 'ocr-status';
  }
  const preview = document.getElementById('ocr-preview');
  if (preview) preview.innerHTML = '';
}