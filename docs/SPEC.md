# NutriScan - Especificación del Producto

## Visión General
Una aplicación web gratuita y sin anuncios para rastrear la información nutricional de productos del supermercado. Permite tomar fotos de las tablas nutricionales, extraer los datos con OCR e IA, y planificar comidas personalizadas agregando productos con cantidades específicas en gramos.

## Ejemplos de las Imágenes Compartidas

### Imagen 1 - Barra de Chocolate Sin Gluten
- **Producto**: Barra de chocolate con leche sin gluten (Dr. Schär AG)
- **Idiomas**: Alemán, Francés, Neerlandés, Italiano
- **Tabla Nutricional**:
  - Por 100g: Energía 2292 kJ / 549 kcal, Grasas 33g, Grasas saturadas 13g, Carbohidratos 55g, Azúcares 45g, Fibra 2.4g, Proteínas 6.8g, Sal 0.18g
  - Por 30g (1 Melto): Energía 688 kJ / 165 kcal, Grasas 10g, Grasas saturadas 3.9g, Carbohidratos 16g, Azúcares 14g, Fibra 0.7g, Proteínas 2.0g, Sal 0.05g
- **Campos extraídos**: Nombre del producto, ingredientes, alérgenos (nueces, soja, leche), información nutricional completa

### Imagen 2 - Zumo de Manzana y Naranja
- **Producto**: Zumo de manzana, naranja y mango (1L, 5 porciones de 200ml)
- **Idioma**: Neerlandés
- **Tabla Nutricional**:
  - Por 100ml: Energía 199 kJ / 47 kcal, Grasas 0g, Carbohidratos 11g, Azúcares 10g, Proteínas 0.7g, Sal 0g
  - Por vaso (200ml): Energía 399 kJ / 94 kcal, Grasas 0g, Carbohidratos 22g, Azúcares 20g, Proteínas 1.4g, Sal 0g
- **Campos extraídos**: Nombre del producto, ingredientes (45% manzana, 35% naranja, 20% mango), información de alérgenos, información nutricional

### Imagen 3 - Spray de Aceite de Oliva
- **Producto**: Extra virgin olive oil spray (200ml)
- **Idioma**: Neerlandés
- **Tabla Nutricional**:
  - Por 100ml: Energía 3404 kJ / 828 kcal, Grasas 92g, Carbohidratos 0g, Proteínas 0g, Sal 0g
- **Campos extraídos**: Nombre del producto, información nutricional por 100ml

## Stack Técnico

### Frontend (public/)
- Aplicación web con HTML, CSS y JavaScript vanilla
- Interfaz de usuario para:
  - Tomar/subir fotos de etiquetas nutricionales
  - Visualizar datos extraídos
  - Crear y gestionar comidas
  - Ver totales nutricionales

### Backend (src/)
- Lógica de negocio en JavaScript/TypeScript
- Módulos para:
  - Extracción OCR con IA (módulo de IA)
  - Gestión de productos y datos nutricionales
  - Cálculo de totales nutricionales
  - Planificación de comidas

### Módulo de IA (OCR)
- Llama a un endpoint OpenAI-compatible configurado por el usuario
- Parámetros configurables: URL del endpoint, API key, modelo
- Las pruebas nunca llaman a este módulo directamente

## Módulos de Lógica

### 1. OCR Module (src/ocr.js)
Funciones exportadas:
- `extractNutritionData(imageData, config)`: Extrae datos nutricionales de una imagen
  - Parámetros: `imageData` (string, base64 de la imagen), `config` (object con url, key, model)
  - Retorna: `Promise<NutritionData>` con los datos extraídos
  - Ejemplo de entrada: base64 de la imagen 1
  - Ejemplo de salida: `{ name: "Barra de chocolate sin gluten", per100g: { energyKj: 2292, energyKcal: 549, fat: 33, saturatedFat: 13, carbs: 55, sugars: 45, fiber: 2.4, protein: 6.8, salt: 0.18 }, perServing: { energyKj: 688, energyKcal: 165, fat: 10, saturatedFat: 3.9, carbs: 16, sugars: 14, fiber: 0.7, protein: 2.0, salt: 0.05 }, servingSize: "30g", ingredients: ["pasta de nueces 57%", "nueces 20%", "lactosa"], allergens: ["nueces", "soja", "leche"] }`

### 2. Product Module (src/product.js)
Funciones exportadas:
- `createProduct(name, nutritionData)`: Crea un nuevo producto
  - Parámetros: `name` (string), `nutritionData` (object con per100g y perServing)
  - Retorna: `Product` object con id, name, per100g, perServing, ingredients, allergens
  - Ejemplo: `createProduct("Zumo de manzana", { per100g: { energyKj: 199, energyKcal: 47, fat: 0, saturatedFat: 0, carbs: 11, sugars: 10, fiber: 0, protein: 0.7, salt: 0 }, perServing: { energyKj: 399, energyKcal: 94, fat: 0, saturatedFat: 0, carbs: 22, sugars: 20, fiber: 0, protein: 1.4, salt: 0 }, servingSize: "200ml" })`
  - Retorna: `{ id: "prod_001", name: "Zumo de manzana", per100g: { energyKj: 199, energyKcal: 47, fat: 0, saturatedFat: 0, carbs: 11, sugars: 10, fiber: 0, protein: 0.7, salt: 0 }, perServing: { energyKj: 399, energyKcal: 94, fat: 0, saturatedFat: 0, carbs: 22, sugars: 20, fiber: 0, protein: 1.4, salt: 0 }, servingSize: "200ml", ingredients: ["45% manzana", "35% naranja", "20% mango"], allergens: [] }`

- `getProduct(id, products)`: Obtiene un producto por ID
  - Parámetros: `id` (string), `products` (array de Product)
  - Retorna: `Product | null`

- `saveProduct(product, products)`: Guarda un producto en el array
  - Parámetros: `product` (Product), `products` (array de Product)
  - Retorna: `Product[]` actualizado

### 3. Meal Module (src/meal.js)
Funciones exportadas:
- `createMeal(name)`: Crea una nueva comida
  - Parámetros: `name` (string)
  - Retorna: `Meal` object con id, name, items (array vacío)
  - Ejemplo: `createMeal("Desayuno")`
  - Retorna: `{ id: "meal_001", name: "Desayuno", items: [] }`

- `addProductToMeal(meal, productId, grams, products)`: Agrega un producto a una comida
  - Parámetros: `meal` (Meal), `productId` (string), `grams` (number), `products` (array de Product)
  - Retorna: `Meal` actualizado con el item agregado
  - Ejemplo: `addProductToMeal(meal, "prod_001", 200, products)`
  - Retorna: `{ id: "meal_001", name: "Desayuno", items: [{ productId: "prod_001", grams: 200, nutrition: { energyKj: 398, energyKcal: 94, fat: 0, saturatedFat: 0, carbs: 22, sugars: 20, fiber: 0, protein: 1.4, salt: 0 } }] }`

- `calculateMealTotals(meal)`: Calcula los totales nutricionales de una comida
  - Parámetros: `meal` (Meal)
  - Retorna: `NutritionTotals` object
  - Ejemplo: `calculateMealTotals(meal)`
  - Retorna: `{ energyKj: 398, energyKcal: 94, fat: 0, saturatedFat: 0, carbs: 22, sugars: 20, fiber: 0, protein: 1.4, salt: 0 }`

- `getMeal(id, meals)`: Obtiene una comida por ID
  - Parámetros: `id` (string), `meals` (array de Meal)
  - Retorna: `Meal | null`

- `saveMeal(meal, meals)`: Guarda una comida en el array
  - Parámetros: `meal` (Meal), `meals` (array de Meal)
  - Retorna: `Meal[]` actualizado

## Interfaz de Usuario

### Pantalla 1: Escáner de Productos
- **Acciones del usuario**:
  - Tomar foto o subir imagen de una etiqueta nutricional
  - Ver los datos extraídos (nombre, ingredientes, alérgenos, tabla nutricional)
  - Editar los datos si es necesario
  - Guardar el producto
- **Funciones llamadas**: `extractNutritionData`, `createProduct`, `saveProduct`

### Pantalla 2: Mis Productos
- **Acciones del usuario**:
  - Ver lista de productos guardados
  - Buscar productos por nombre
  - Ver detalles de cada producto (ingredientes, alérgenos, tabla nutricional)
  - Eliminar productos
- **Funciones llamadas**: `getProduct`, `saveProduct`

### Pantalla 3: Planificador de Comidas
- **Acciones del usuario**:
  - Crear una nueva comida (desayuno, almuerzo, cena, snack)
  - Agregar productos a la comida con cantidad en gramos
  - Ver totales nutricionales de la comida
  - Eliminar productos de la comida
  - Guardar la comida
- **Funciones llamadas**: `createMeal`, `addProductToMeal`, `calculateMealTotals`, `saveMeal`, `getMeal`

### Pantalla 4: Configuración
- **Acciones del usuario**:
  - Configurar el endpoint de IA (URL, API key, modelo)
  - Ver información sobre la app (gratis, sin anuncios)
- **Funciones llamadas**: Ninguna (solo configuración local)

## Criterios de Aceptación

### AC-1: Extracción de Datos Nutricionales
- Dado que el usuario sube una foto de una etiqueta nutricional
- Cuando el sistema procesa la imagen con OCR e IA
- Entonces se extraen los datos nutricionales (energía, grasas, carbohidratos, azúcares, proteínas, sal)
- Y se muestran al usuario para revisión y edición

### AC-2: Almacenamiento de Productos
- Dado que el usuario ha revisado los datos extraídos
- Cuando el usuario guarda el producto
- Entonces el producto se almacena con su nombre, datos nutricionales por 100g y por porción, ingredientes y alérgenos

### AC-3: Planificación de Comidas
- Dado que el usuario tiene productos guardados
- Cuando el usuario crea una nueva comida y agrega productos con cantidades en gramos
- Entonces se calculan los totales nutricionales basados en las cantidades agregadas

### AC-4: Cálculo de Totales Nutricionales
- Dado que una comida tiene productos con cantidades específicas
- Cuando el usuario solicita los totales
- Entonces se muestran los totales de energía (kJ y kcal), grasas, grasas saturadas, carbohidratos, azúcares, fibra, proteínas y sal

### AC-5: Interfaz de Usuario
- Dado que el usuario accede a la aplicación
- Entonces puede navegar entre las pantallas de escáner, productos, planificador y configuración
- Y la interfaz es simple, limpia y enfocada en el rastreo nutricional personalizado

### AC-6: Aplicación Gratuita y Sin Anuncios
- Dado que el usuario usa la aplicación
- Entonces no se muestran anuncios
- Y no se requiere pago para ninguna funcionalidad

### AC-7: Configuración de IA
- Dado que el usuario configura el endpoint de IA
- Entonces la aplicación usa esa configuración para extraer datos de las imágenes
- Y la configuración se guarda localmente en el navegador

### AC-8: Soporte para Múltiples Idiomas
- Dado que la etiqueta nutricional está en un idioma diferente (alemán, neerlandés, italiano, francés)
- Cuando el sistema extrae los datos
- Entonces se identifican correctamente los campos nutricionales independientemente del idioma

### AC-9: Cálculo Proporcional
- Dado que un producto tiene datos por 100g y el usuario agrega 200g
- Entonces los totales se calculan proporcionalmente (doble de los valores por 100g)

### AC-10: Gestión de Alérgenos
- Dado que un producto tiene alérgenos identificados (nueces, soja, leche)
- Entonces se muestran claramente al usuario al ver los detalles del producto

## Notas Técnicas
- La aplicación es una web app con frontend en public/ y backend en src/
- Los datos se almacenan localmente en el navegador (localStorage)
- El módulo de IA se configura con un endpoint OpenAI-compatible
- Las pruebas unitarias no llaman al módulo de IA directamente, sino que simulan sus respuestas
- La aplicación es gratuita y sin anuncios, enfocada en el rastreo nutricional personalizado sin enfoques específicos (pérdida de peso, salud cardíaca, etc.)