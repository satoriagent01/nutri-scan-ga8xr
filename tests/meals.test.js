import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { createMeal, addProductToMeal } from "../src/meals.js";

describe("createMeal", () => {
  test("should create a new meal with a unique ID", async () => {
    const meals = {};
    const mealData = {
      name: "Breakfast",
      date: "2024-01-15"
    };

    const result = await createMeal(meals, mealData);

    assert.equal(result.success, true);
    assert.ok(result.meal.id);
    assert.equal(result.meal.name, "Breakfast");
    assert.equal(result.meal.date, "2024-01-15");
    assert.equal(result.meal.products.length, 0);
  });

  test("should create multiple meals with different IDs", async () => {
    const meals = {};
    const meal1 = await createMeal(meals, { name: "Breakfast", date: "2024-01-15" });
    const meal2 = await createMeal(meals, { name: "Lunch", date: "2024-01-15" });

    assert.notEqual(meal1.meal.id, meal2.meal.id);
    assert.ok(meals[meal1.meal.id]);
    assert.ok(meals[meal2.meal.id]);
  });

  test("should return meal with empty products array initially", async () => {
    const meals = {};
    const result = await createMeal(meals, { name: "Dinner", date: "2024-01-15" });

    assert.ok(Array.isArray(result.meal.products));
    assert.equal(result.meal.products.length, 0);
  });
});

describe("addProductToMeal", () => {
  test("should add a product to an existing meal", async () => {
    const meals = {};
    const mealResult = await createMeal(meals, { name: "Breakfast", date: "2024-01-15" });
    const mealId = mealResult.meal.id;

    const product = {
      id: "product-1",
      name: "Oatmeal",
      calories: 150,
      protein: 5,
      carbs: 27,
      fat: 3
    };

    const result = await addProductToMeal(meals, mealId, product);

    assert.equal(result.success, true);
    assert.equal(result.meal.products.length, 1);
    assert.equal(result.meal.products[0].product.name, "Oatmeal");
    assert.equal(result.meal.products[0].quantity, 1);
  });

  test("should add multiple products to a meal", async () => {
    const meals = {};
    const mealResult = await createMeal(meals, { name: "Lunch", date: "2024-01-15" });
    const mealId = mealResult.meal.id;

    const product1 = {
      id: "product-1",
      name: "Salad",
      calories: 200,
      protein: 10,
      carbs: 20,
      fat: 8
    };
    const product2 = {
      id: "product-2",
      name: "Chicken",
      calories: 300,
      protein: 30,
      carbs: 0,
      fat: 15
    };

    await addProductToMeal(meals, mealId, product1);
    const result = await addProductToMeal(meals, mealId, product2);

    assert.equal(result.meal.products.length, 2);
  });

  test("should fail when adding to non-existent meal", async () => {
    const meals = {};
    const product = {
      id: "product-1",
      name: "Test",
      calories: 100,
      protein: 5,
      carbs: 10,
      fat: 2
    };

    const result = await addProductToMeal(meals, "non-existent-id", product);

    assert.equal(result.success, false);
    assert.equal(result.error, "Meal not found");
  });

  test("should add product with custom quantity", async () => {
    const meals = {};
    const mealResult = await createMeal(meals, { name: "Snack", date: "2024-01-15" });
    const mealId = mealResult.meal.id;

    const product = {
      id: "product-1",
      name: "Apple",
      calories: 95,
      protein: 0.5,
      carbs: 25,
      fat: 0.3
    };

    const result = await addProductToMeal(meals, mealId, product, 2);

    assert.equal(result.meal.products[0].quantity, 2);
  });

  test("should update quantity when adding same product twice", async () => {
    const meals = {};
    const mealResult = await createMeal(meals, { name: "Breakfast", date: "2024-01-15" });
    const mealId = mealResult.meal.id;

    const product = {
      id: "product-1",
      name: "Coffee",
      calories: 5,
      protein: 0.3,
      carbs: 0,
      fat: 0
    };

    await addProductToMeal(meals, mealId, product, 1);
    const result = await addProductToMeal(meals, mealId, product, 1);

    assert.equal(result.meal.products.length, 1);
    assert.equal(result.meal.products[0].quantity, 2);
  });
});