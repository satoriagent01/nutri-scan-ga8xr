/**
 * OCR module - extracts nutrition data from OCR text.
 * In production this would call an AI endpoint, but for tests it parses text directly.
 */

/**
 * Parses an OCR text string and extracts nutrition data.
 * @param {string} ocrText - The raw OCR text from the image.
 * @returns {Promise<Object>} Extracted nutrition data.
 */
export async function extractNutritionData(ocrText) {
  const result = {
    calories: 0,
    totalFat: 0,
    saturatedFat: 0,
    transFat: 0,
    cholesterol: 0,
    sodium: 0,
    totalCarbohydrate: 0,
    dietaryFiber: 0,
    totalSugars: 0,
    protein: 0,
    vitaminD: 0,
    calcium: 0,
    iron: 0,
    potassium: 0,
  };

  if (!ocrText || typeof ocrText !== "string") {
    return result;
  }

  const lines = ocrText.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();

    // Calories
    const caloriesMatch = trimmed.match(/calories?\s*[:\-]?\s*(\d+(?:\.\d+)?)/i);
    if (caloriesMatch) {
      result.calories = parseFloat(caloriesMatch[1]);
      continue;
    }

    // Total Fat
    const totalFatMatch = trimmed.match(/total\s*fat\s*[:\-]?\s*(\d+(?:\.\d+)?)/i);
    if (totalFatMatch) {
      result.totalFat = parseFloat(totalFatMatch[1]);
      continue;
    }

    // Saturated Fat
    const satFatMatch = trimmed.match(/saturated\s*fat\s*[:\-]?\s*(\d+(?:\.\d+)?)/i);
    if (satFatMatch) {
      result.saturatedFat = parseFloat(satFatMatch[1]);
      continue;
    }

    // Trans Fat
    const transFatMatch = trimmed.match(/trans\s*fat\s*[:\-]?\s*(\d+(?:\.\d+)?)/i);
    if (transFatMatch) {
      result.transFat = parseFloat(transFatMatch[1]);
      continue;
    }

    // Cholesterol
    const cholMatch = trimmed.match(/cholesterol\s*[:\-]?\s*(\d+(?:\.\d+)?)/i);
    if (cholMatch) {
      result.cholesterol = parseFloat(cholMatch[1]);
      continue;
    }

    // Sodium
    const sodiumMatch = trimmed.match(/sodium\s*[:\-]?\s*(\d+(?:\.\d+)?)/i);
    if (sodiumMatch) {
      result.sodium = parseFloat(sodiumMatch[1]);
      continue;
    }

    // Total Carbohydrate
    const carbMatch = trimmed.match(/total\s*carbohydrate\s*[:\-]?\s*(\d+(?:\.\d+)?)/i);
    if (carbMatch) {
      result.totalCarbohydrate = parseFloat(carbMatch[1]);
      continue;
    }

    // Dietary Fiber
    const fiberMatch = trimmed.match(/dietary\s*fiber\s*[:\-]?\s*(\d+(?:\.\d+)?)/i);
    if (fiberMatch) {
      result.dietaryFiber = parseFloat(fiberMatch[1]);
      continue;
    }

    // Total Sugars
    const sugarsMatch = trimmed.match(/total\s*sugars\s*[:\-]?\s*(\d+(?:\.\d+)?)/i);
    if (sugarsMatch) {
      result.totalSugars = parseFloat(sugarsMatch[1]);
      continue;
    }

    // Protein
    const proteinMatch = trimmed.match(/protein\s*[:\-]?\s*(\d+(?:\.\d+)?)/i);
    if (proteinMatch) {
      result.protein = parseFloat(proteinMatch[1]);
      continue;
    }

    // Vitamin D
    const vitaminDMatch = trimmed.match(/vitamin\s*d\s*[:\-]?\s*(\d+(?:\.\d+)?)/i);
    if (vitaminDMatch) {
      result.vitaminD = parseFloat(vitaminDMatch[1]);
      continue;
    }

    // Calcium
    const calciumMatch = trimmed.match(/calcium\s*[:\-]?\s*(\d+(?:\.\d+)?)/i);
    if (calciumMatch) {
      result.calcium = parseFloat(calciumMatch[1]);
      continue;
    }

    // Iron
    const ironMatch = trimmed.match(/iron\s*[:\-]?\s*(\d+(?:\.\d+)?)/i);
    if (ironMatch) {
      result.iron = parseFloat(ironMatch[1]);
      continue;
    }

    // Potassium
    const potassiumMatch = trimmed.match(/potassium\s*[:\-]?\s*(\d+(?:\.\d+)?)/i);
    if (potassiumMatch) {
      result.potassium = parseFloat(potassiumMatch[1]);
      continue;
    }
  }

  return result;
}