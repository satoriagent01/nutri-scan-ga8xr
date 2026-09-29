# Especificación del Producto: NutriScan

## 1. Descripción General

NutriScan es una aplicación web gratuita y sin anuncios para el seguimiento de la nutrición. Permite a los usuarios tomar o subir fotos de etiquetas nutricionales de productos, extraer los datos mediante OCR con IA, almacenar la información de los productos y crear comidas personalizadas añadiendo productos con cantidades en gramos, calculando automáticamente el total nutricional.

**Stack Tecnológico:**
- **Frontend:** `public/` (HTML, CSS, JavaScript vanilla)
- **Backend:** `src/` (Node.js/Express o similar)
- **OCR con IA:** Módulo detrás de un endpoint configurable (URL, clave API, modelo) que el usuario configura en la interfaz de usuario. Las pruebas nunca llaman a este servicio.

## 2. Criterios de Aceptación

### AC-1: Subida de Foto de Etiqueta
- El usuario puede subir una foto de una etiqueta nutricional de producto.
- La interfaz muestra la foto subida y un estado de procesamiento.
- Se simula la extracción OCR (para desarrollo) pero la interfaz permite la integración real con el servicio de IA.

### AC-2: Extracción de Datos Nutricionales
- El sistema extrae los siguientes campos de la etiqueta:
  - Nombre del producto
  - Energía (kJ y kcal) por 100g
  - Grasa (g) por 100g
  - Grasa saturada (g) por 100g
  - Carbohidratos (g) por 100g
  - Azúcares (g) por 100g
  - Proteína (g) por 100g
  - Sal/Sodio (g) por 100g
- Los datos extraídos se muestran al usuario para confirmación/edición antes de guardar.

### AC-3: Almacenamiento de Productos
- Los productos extraídos se almacenan con su información nutricional por 100g.
- El usuario puede ver la lista de productos guardados.
- Cada producto tiene: nombre, energía_kj, energia_kcal, grasa, grasa_saturada, carbohidratos, azucares, proteina, sal.

### AC-4: Creación de Comidas Personalizadas
- El usuario puede crear una nueva comida.
- Puede añadir productos a la comida especificando la cantidad en gramos.
- La interfaz muestra la lista de productos disponibles para añadir.

### AC-5: Cálculo de Totales Nutricionales
- El sistema calcula el total nutricional de la comida basado en las cantidades en gramos de cada producto añadido.
- Los totales incluyen: energía (kJ y kcal), grasa, grasa saturada, carbohidratos, azúcares, proteína, sal.
- El cálculo se realiza como: `(valor_por_100g * gramos / 100)` para cada nutriente.

### AC-6: Interfaz de Usuario Simple y Limpia
- La interfaz es simple, limpia y enfocada en el seguimiento nutricional.
- No hay enfoque en pérdida de peso ni salud cardíaca.
- Solo seguimiento personalizado de nutrición.

## 3. Ejemplos de Etiquetas (Valores Reales)

### Ejemplo 1: Etiqueta de Galletas
```
Nombre: Galletas de Chocolate
Energía: 2100 kJ / 500 kcal
Grasa: 20g
Grasa Saturada: 9g
Carbohidratos: 65g
Azúcares: 25g
Proteína: 7g
Sal: 1.2g
(Todos los valores por 100g)
```

### Ejemplo 2: Etiqueta de Yogur
```
Nombre: Yogur Natural
Energía: 300 kJ / 70 kcal
Grasa: 0.5g
Grasa Saturada: 0.3g
Carbohidratos: 4g
Azúcares: 4g
Proteína: 6g
Sal: 0.1g
(Todos los valores por 100g)
```

## 4. Stack Tecnológico

### Estructura del Repositorio
- `public/` - Frontend (HTML, CSS, JavaScript)
- `src/` - Backend (API, lógica de negocio)
- `docs/SPEC.md` - Esta especificación

### Módulo de OCR con IA
- Detrás de un endpoint configurable en la interfaz de usuario.
- El usuario configura: URL del endpoint, clave API, modelo.
- Las pruebas nunca llaman a este servicio; se simula para desarrollo.

## 5. Módulos de Lógica

### 5.1 Módulo: `ocr` (extracción de datos de etiquetas)

#### Función: `extractNutritionData(imageBuffer)`
- **Parámetros:** `imageBuffer` (Buffer de la imagen)
- **Retorno:** `Promise<NutritionData>` - Datos nutricionales extraídos
- **Tipo:** Asíncrona
- **Descripción:** Extrae los datos nutricionales de la imagen usando OCR con IA.
- **Ejemplo de entrada:** Buffer de imagen de una etiqueta de galletas
- **Ejemplo de salida:**
  ```javascript
  {
    nombre: "Galletas de Chocolate",
    energia_kj: 2100,
    energia_kcal: 500,
    grasa: 20,
    grasa_saturada: 9,
    carbohidratos: 65,
    azucares: 25,
    proteina: 7,
    sal: 1.2
  }
  ```

### 5.2 Módulo: `products` (gestión de productos)

#### Función: `saveProduct(productData)`
- **Parámetros:** `productData` (objeto NutritionData)
- **Retorno:** `Promise<string>` - ID del producto guardado
- **Tipo:** Asíncrona
- **Descripción:** Guarda un producto en el almacenamiento.
- **Ejemplo de entrada:**
  ```javascript
  {
    nombre: "Yogur Natural",
    energia_kj: 300,
    energia_kcal: 70,
    grasa: 0.5,
    grasa_saturada: 0.3,
    carbohidratos: 4,
    azucares: 4,
    proteina: 6,
    sal: 0.1
  }
  ```
- **Ejemplo de salida:** `"prod_001"`

#### Función: `getAllProducts()`
- **Parámetros:** Ninguno
- **Retorno:** `Promise<NutritionData[]>` - Lista de todos los productos
- **Tipo:** Asíncrona
- **Descripción:** Retorna todos los productos almacenados.

### 5.3 Módulo: `meals` (gestión de comidas y cálculos)

#### Función: `createMeal(mealName)`
- **Parámetros:** `mealName` (string)
- **Retorno:** `Promise<string>` - ID de la comida creada
- **Tipo:** Asíncrona
- **Descripción:** Crea una nueva comida vacía.

#### Función: `addProductToMeal(mealId, productId, grams)`
- **Parámetros:** 
  - `mealId` (string) - ID de la comida
  - `productId` (string) - ID del producto
  - `grams` (number) - Cantidad en gramos
- **Retorno:** `Promise<void>`
- **Tipo:** Asíncrona
- **Descripción:** Añade un producto a una comida con una cantidad específica.

#### Función: `calculateMealTotals(mealId)`
- **Parámetros:** `mealId` (string)
- **Retorno:** `Promise<NutritionTotals>`
- **Tipo:** Asíncrona
- **Descripción:** Calcula los totales nutricionales de una comida.
- **Ejemplo de salida:**
  ```javascript
  {
    energia_kj: 1050,
    energia_kcal: 250,
    grasa: 10,
    grasa_saturada: 4.5,
    carbohidratos: 32.5,
    azucares: 12.5,
    proteina: 3.5,
    sal: 0.6
  }
  ```

## 6. Interfaz de Usuario

### Pantalla 1: Subir Etiqueta
- **Acciones del usuario:**
  - Seleccionar/tomar una foto de una etiqueta nutricional
  - Ver la foto subida
  - Ver el estado de procesamiento OCR
  - Ver los datos extraídos para confirmación/edición
  - Guardar el producto
- **Funciones de lógica llamadas:**
  - `ocr.extractNutritionData(imageBuffer)`
  - `products.saveProduct(productData)`

### Pantalla 2: Lista de Productos
- **Acciones del usuario:**
  - Ver la lista de productos guardados
  - Ver los detalles nutricionales de cada producto
- **Funciones de lógica llamadas:**
  - `products.getAllProducts()`

### Pantalla 3: Crear Comida
- **Acciones del usuario:**
  - Nombrar la nueva comida
  - Seleccionar productos de la lista
  - Especificar la cantidad en gramos para cada producto
  - Ver los totales nutricionales calculados
- **Funciones de lógica llamadas:**
  - `meals.createMeal(mealName)`
  - `meals.addProductToMeal(mealId, productId, grams)`
  - `meals.calculateMealTotals(mealId)`

### Pantalla 4: Configuración OCR
- **Acciones del usuario:**
  - Configurar la URL del endpoint OCR
  - Configurar la clave API
  - Configurar el modelo de IA
- **Funciones de lógica llamadas:**
  - Guardar configuración en el almacenamiento local

## 7. Modelo de Datos

### NutritionData
```javascript
{
  nombre: string,
  energia_kj: number,
  energia_kcal: number,
  grasa: number,
  grasa_saturada: number,
  carbohidratos: number,
  azucares: number,
  proteina: number,
  sal: number
}
```

### MealItem
```javascript
{
  productId: string,
  grams: number
}
```

### Meal
```javascript
{
  id: string,
  name: string,
  items: MealItem[],
  createdAt: Date
}
```

### NutritionTotals
```javascript
{
  energia_kj: number,
  energia_kcal: number,
  grasa: number,
  grasa_saturada: number,
  carbohidratos: number,
  azucares: number,
  proteina: number,
  sal: number
}
```

## 8. Notas de Implementación

- Los datos se almacenan en el almacenamiento local del navegador para el frontend.
- El backend proporciona una API REST para la persistencia de datos.
- La simulación OCR se usa durante el desarrollo; la integración real se hace mediante el endpoint configurable.
- Las pruebas unitarias nunca llaman al servicio de OCR; se mockean las funciones relevantes.