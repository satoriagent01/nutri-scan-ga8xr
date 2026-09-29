import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { saveProduct, getAllProducts } from "../src/storage.js";

describe("saveProduct", () => {
  test("should save a product to storage", async () => {
    const storage = {};
    const product = {
      id: "product-1",
      name: "Test Product",
      calories: 250,
      protein: 10,
      carbs: 30,
      fat: 15
    };

    const result = await saveProduct(storage, product);

    assert.equal(result.success, true);
    assert.equal(result.product.id, "product-1");
    assert.equal(result.product.name, "Test Product");
  });

  test("should generate an ID if not provided", async () => {
    const storage = {};
    const product = {
      name: "Another Product",
      calories: 200,
      protein: 5,
      carbs: 25,
      fat: 10
    };

    const result = await saveProduct(storage, product);

    assert.equal(result.success, true);
    assert.ok(result.product.id);
    assert.ok(result.product.id.length > 0);
  });

  test("should overwrite existing product with same ID", async () => {
    const storage = {};
    const product1 = {
      id: "product-1",
      name: "Original Product",
      calories: 250,
      protein: 10,
      carbs: 30,
      fat: 15
    };

    const product2 = {
      id: "product-1",
      name: "Updated Product",
      calories: 300,
      protein: 15,
      carbs: 25,
      fat: 20
    };

    await saveProduct(storage, product1);
    const result = await saveProduct(storage, product2);

    assert.equal(result.product.name, "Updated Product");
    assert.equal(result.product.calories, 300);
  });
});

describe("getAllProducts", () => {
  test("should return all saved products", async () => {
    const storage = {};
    const product1 = {
      id: "product-1",
      name: "Product A",
      calories: 250,
      protein: 10,
      carbs: 30,
      fat: 15
    };
    const product2 = {
      id: "product-2",
      name: "Product B",
      calories: 200,
      protein: 8,
      carbs: 25,
      fat: 10
    };

    await saveProduct(storage, product1);
    await saveProduct(storage, product2);

    const products = await getAllProducts(storage);

    assert.equal(products.length, 2);
    assert.ok(products.some(p => p.name === "Product A"));
    assert.ok(products.some(p => p.name === "Product B"));
  });

  test("should return empty array when no products saved", async () => {
    const storage = {};
    const products = await getAllProducts(storage);

    assert.equal(products.length, 0);
    assert.ok(Array.isArray(products));
  });

  test("should return products with correct structure", async () => {
    const storage = {};
    const product = {
      id: "product-1",
      name: "Test Product",
      calories: 250,
      protein: 10,
      carbs: 30,
      fat: 15
    };

    await saveProduct(storage, product);
    const products = await getAllProducts(storage);

    assert.equal(products.length, 1);
    assert.equal(products[0].id, "product-1");
    assert.equal(products[0].name, "Test Product");
    assert.equal(products[0].calories, 250);
  });
});