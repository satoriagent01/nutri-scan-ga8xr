import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { calculateMealTotals } from "../src/calculate.js";

describe("calculateMealTotals", () => {
  test("should calculate totals for a meal with one product", async () => {
    const meal = {
      id: "meal-1",
      name: "Breakfast",
      date: "2024-01-15",
      products: [
        {
          product: {
            id: "product-1",
            name: "Oatmeal",
            calories: 150,
            protein: 5,
            carbs: 27,
            fat: 3
          },
          quantity: 1
        }
      ]
    };

    const result = await calculateMealTotals(meal);

    assert.equal(result.calories, 150);
    assert.equal(result.protein, 5);
    assert.equal(result.carbs, 27);
    assert.equal(result.fat, 3);
  });

  test("should calculate totals for a meal with multiple products", async () => {
    const meal = {
      id: "meal-1",
      name: "Lunch",
      date: "2024-01-15",
      products: [
        {
          product: {
            id: "product-1",
            name: "Salad",
            calories: 200,
            protein: 10,
            carbs: 20,
            fat: 8
          },
          quantity: 1
        },
        {
          product: {
            id: "product-2",
            name: "Chicken",
            calories: 300,
            protein: 30,
            carbs: 0,
            fat: 15
          },
          quantity: 1
        }
      ]
    };

    const result = await calculateMealTotals(meal);

    assert.equal(result.calories, 500);
    assert.equal(result.protein, 40);
    assert.equal(result.carbs, 20);
    assert.equal(result.fat, 23);
  });

  test("should multiply nutrition by quantity", async () => {
    const meal = {
      id: "meal-1",
      name: "Snack",
      date: "2024-01-15",
      products: [
        {
          product: {
            id: "product-1",
            name: "Apple",
            calories: 95,
            protein: 0.5,
            carbs: 25,
            fat: 0.3
          },
          quantity: 2
        }
      ]
    };

    const result = await calculateMealTotals(meal);

    assert.equal(result.calories, 190);
    assert.equal(result.protein, 1);
    assert.equal(result.carbs, 50);
    assert.equal(result.fat, 0.6);
  });

  test("should return zero totals for empty meal", async () => {
    const meal = {
      id: "meal-1",
      name: "Empty Meal",
      date: "2024-01-15",
      products: []
    };

    const result = await calculateMealTotals(meal);

    assert.equal(result.calories, 0);
    assert.equal(result.protein, 0);
    assert.equal(result.carbs, 0);
    assert.equal(result.fat, 0);
  });

  test("should handle decimal values correctly", async () => {
    const meal = {
      id: "meal-1",
      name: "Mixed Meal",
      date: "2024-01-15",
      products: [
        {
          product: {
            id: "product-1",
            name: "Yogurt",
            calories: 100.5,
            protein: 8.2,
            carbs: 12.3,
            fat: 4.7
          },
          quantity: 1
        },
        {
          product: {
            id: "product-2",
            name: "Granola",
            calories: 50.3,
            protein: 2.1,
            carbs: 8.5,
            fat: 1.2
          },
          quantity: 1
        }
      ]
    };

    const result = await calculateMealTotals(meal);

    assert.equal(result.calories, 150.8);
    assert.equal(result.protein, 10.3);
    assert.equal(result.carbs, 20.8);
    assert.equal(result.fat, 5.9);
  });

  test("should handle multiple products with quantities", async () => {
    const meal = {
      id: "meal-1",
      name: "Full Day",
      date: "2024-01-15",
      products: [
        {
          product: {
            id: "product-1",
            name: "Coffee",
            calories: 5,
            protein: 0.3,
            carbs: 0,
            fat: 0
          },
          quantity: 2
        },
        {
          product: {
            id: "product-2",
            name: "Toast",
            calories: 80,
            protein: 3,
            carbs: 15,
            fat: 1
          },
          quantity: 2
        },
        {
          product: {
            id: "product-3",
            name: "Orange Juice",
            calories: 110,
            protein: 2,
            carbs: 26,
            fat: 0
          },
          quantity: 1
        }
      ]
    };

    const result = await calculateMealTotals(meal);

    assert.equal(result.calories, 280);
    assert.equal(result.protein, 8.6);
    assert.equal(result.carbs, 67);
    assert.equal(result.fat, 3);
  });
});