import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { saveProduct, getAllProducts, clearProducts } from "../src/products.js";

describe("saveProduct", () => {
  test("should save a product with all nutrition fields", async () => {
    const product = {
      nombre: "Yogur Natural",
      energia_kj: 300,
      energia_kcal: 70,
      grasa: 0.5,
      grasa_saturada: 0.3,
      carbohidratos: 4,
      azucares: 4,
      proteina: 6,
      sal: 0.1
    };

    const id = await saveProduct(product);

    assert.ok(id);
    assert.equal(typeof id, "string");
  });

  test("should return an ID for the saved product", async () => {
    const product = {
      nombre: "Galletas de Chocolate",
      energia_kj: 2100,
      energia_kcal: 500,
      grasa: 20,
      grasa_saturada: 9,
      carbohidratos: 65,
      azucares: 25,
      proteina: 7,
      sal: 1.2
    };

    const id = await saveProduct(product);

    assert.ok(id);
    assert.ok(id.length > 0);
  });
});

describe("getAllProducts", () => {
  test("should return all saved products", async () => {
    clearProducts();
    const product1 = {
      nombre: "Yogur Natural",
      energia_kj: 300,
      energia_kcal: 70,
      grasa: 0.5,
      grasa_saturada: 0.3,
      carbohidratos: 4,
      azucares: 4,
      proteina: 6,
      sal: 0.1
    };

    const product2 = {
      nombre: "Galletas de Chocolate",
      energia_kj: 2100,
      energia_kcal: 500,
      grasa: 20,
      grasa_saturada: 9,
      carbohidratos: 65,
      azucares: 25,
      proteina: 7,
      sal: 1.2
    };

    await saveProduct(product1);
    await saveProduct(product2);

    const products = await getAllProducts();

    assert.equal(products.length, 2);
    assert.ok(products.some(p => p.nombre === "Yogur Natural"));
    assert.ok(products.some(p => p.nombre === "Galletas de Chocolate"));
  });

  test("should return empty array when no products saved", async () => {
    clearProducts();
    const products = await getAllProducts();

    assert.equal(products.length, 0);
    assert.ok(Array.isArray(products));
  });

  test("should return products with correct structure", async () => {
    clearProducts();
    const product = {
      nombre: "Test Product",
      energia_kj: 500,
      energia_kcal: 120,
      grasa: 5,
      grasa_saturada: 2,
      carbohidratos: 15,
      azucares: 8,
      proteina: 3,
      sal: 0.5
    };

    await saveProduct(product);
    const products = await getAllProducts();

    assert.equal(products.length, 1);
    assert.equal(products[0].nombre, "Test Product");
    assert.equal(products[0].energia_kj, 500);
    assert.equal(products[0].energia_kcal, 120);
    assert.equal(products[0].grasa, 5);
    assert.equal(products[0].grasa_saturada, 2);
    assert.equal(products[0].carbohidratos, 15);
    assert.equal(products[0].azucares, 8);
    assert.equal(products[0].proteina, 3);
    assert.equal(products[0].sal, 0.5);
  });
});