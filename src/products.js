import { randomUUID } from "node:crypto";

const products = [];

export async function saveProduct(productData) {
  const id = randomUUID();
  const product = {
    id,
    nombre: productData.nombre,
    energia_kj: productData.energia_kj,
    energia_kcal: productData.energia_kcal,
    grasa: productData.grasa,
    grasa_saturada: productData.grasa_saturada,
    carbohidratos: productData.carbohidratos,
    azucares: productData.azucares,
    proteina: productData.proteina,
    sal: productData.sal,
  };
  products.push(product);
  return id;
}

export async function getAllProducts() {
  return products.map((p) => ({
    id: p.id,
    nombre: p.nombre,
    energia_kj: p.energia_kj,
    energia_kcal: p.energia_kcal,
    grasa: p.grasa,
    grasa_saturada: p.grasa_saturada,
    carbohidratos: p.carbohidratos,
    azucares: p.azucares,
    proteina: p.proteina,
    sal: p.sal,
  }));
}