import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { extractNutritionData } from "../src/ocr.js";

describe("extractNutritionData", () => {
  test("should extract nutrition data from a sample OCR text", async () => {
    const ocrText = `
      Nutrition Facts
      Serving Size: 100g
      Servings Per Container: 1
      Calories: 250
      Total Fat: 10g
      Saturated Fat: 3g
      Trans Fat: 0g
      Cholesterol: 20mg
      Sodium: 400mg
      Total Carbohydrate: 35g
      Dietary Fiber: 2g
      Total Sugars: 15g
      Protein: 5g
      Vitamin D: 2mcg
      Calcium: 100mg
      Iron: 2mg
      Potassium: 200mg
    `;

    const result = await extractNutritionData(ocrText);

    assert.equal(result.calories, 250);
    assert.equal(result.totalFat, 10);
    assert.equal(result.saturatedFat, 3);
    assert.equal(result.transFat, 0);
    assert.equal(result.cholesterol, 20);
    assert.equal(result.sodium, 400);
    assert.equal(result.totalCarbohydrate, 35);
    assert.equal(result.dietaryFiber, 2);
    assert.equal(result.totalSugars, 15);
    assert.equal(result.protein, 5);
    assert.equal(result.vitaminD, 2);
    assert.equal(result.calcium, 100);
    assert.equal(result.iron, 2);
    assert.equal(result.potassium, 200);
  });

  test("should return zero values for empty OCR text", async () => {
    const result = await extractNutritionData("");

    assert.equal(result.calories, 0);
    assert.equal(result.totalFat, 0);
    assert.equal(result.protein, 0);
    assert.equal(result.totalCarbohydrate, 0);
  });

  test("should handle OCR text with missing fields", async () => {
    const ocrText = `
      Nutrition Facts
      Serving Size: 50g
      Calories: 150
      Protein: 8g
    `;

    const result = await extractNutritionData(ocrText);

    assert.equal(result.calories, 150);
    assert.equal(result.protein, 8);
    assert.equal(result.totalFat, 0);
    assert.equal(result.sodium, 0);
  });

  test("should parse decimal values correctly", async () => {
    const ocrText = `
      Calories: 125.5
      Total Fat: 5.5g
      Protein: 3.2g
      Total Carbohydrate: 15.7g
    `;

    const result = await extractNutritionData(ocrText);

    assert.equal(result.calories, 125.5);
    assert.equal(result.totalFat, 5.5);
    assert.equal(result.protein, 3.2);
    assert.equal(result.totalCarbohydrate, 15.7);
  });

  test("should handle null or undefined input", async () => {
    const resultNull = await extractNutritionData(null);
    assert.equal(resultNull.calories, 0);

    const resultUndefined = await extractNutritionData(undefined);
    assert.equal(resultUndefined.calories, 0);
  });
});