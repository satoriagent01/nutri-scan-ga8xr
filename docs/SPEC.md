# NutriScan - Especificación del Producto

## Visión General
Una aplicación web gratuita y sin publicidad para rastrear la información nutricional de productos alimenticios. Permite tomar fotos de las tablas nutricionales de los productos, extraer los datos mediante OCR con IA, y planificar comidas personalizadas agregando productos con cantidades específicas en gramos.

## Ejemplos de las Imágenes Compartidas

### Imagen 1 - Producto de Chocolate
- **Producto**: Barrita de chocolate sin gluten (Dr. Schär AG)
- **Tabla nutricional multilingüe**: Alemán, Francés, Neerlandés, Italiano
- **Campos extraídos**:
  - Energie: 2292 kJ / 549 kcal (por 100g), 688 kJ / 165 kcal (por 30g = 1 Melto)
  - Fett: 33 g (por 100g), 10 g (por 30g)
  - Kohlenhydrate: 55 g (por 100g), 16 g (por 30g)
  - Zucker: 45 g (por 100g), 14 g (por 30g)
  - Ballaststoffe: 2.4 g (por 100g), 0.7 g (por 30g)
  - Eiweiß: 6.8 g (por 100g), 2.0 g (por 30g)
  - Salz: 0.18 g (por 100g), 0.05 g (por 30g)
- **Unidades**: kJ, kcal, g

### Imagen 2 - Jugo de Manzana
- **Producto**: Versgeperst Appel-Sinaasappel- en Mangosap (1L / 5 porciones de 200ml)
- **Tabla nutricional en neerlandés**:
  - energie: 199 kJ / 47 kcal (por 100ml), 399 kJ / 94 kcal (por 200ml)
  - vetten: 0 g (por 100ml), 0 g (por 200ml)
  - koolhydraten: 11 g (por 100ml), 22 g (por 200ml)
  - suikers: 10 g (por 100ml), 20 g (por 200ml)
  - eiwitten: 0.4 g (por 100ml), 0.8 g (por 200ml)
  - zout: 0 g (por 100ml), 0 g (por 200ml)
- **Unidades**: kJ, kcal, g, ml

### Imagen 3 - Aceite de Oliva en Spray
- **Producto**: Extra Olijfolie van de Eerste Persing (200ml)
- **Tabla nutricional por 100ml**:
  - energie: 3404 kJ / 828 kcal
  - vetten: 92 g
  - koolhydraten: 0 g
  - eiwitten: 0 g
  - zout: 0 g
- **Unidades**: kJ, kcal, g, ml

## Stack Técnico

### Arquitectura
- **Frontend**: `public/` - Aplicación web (HTML/CSS/JS vanilla o framework ligero)
- **Backend**: `src/` - API REST para lógica de negocio y almacenamiento
- **OCR con IA**: Módulo en `src/ocr/` que llama a un endpoint OpenAI-compatible configurado por el usuario

### Configuración del Usuario
El usuario configura en la interfaz:
- URL del endpoint de IA (OpenAI-compatible)
- API Key
- Modelo a utilizar

Las pruebas nunca llaman al endpoint de IA; usan datos simulados.

## Módulos de Lógica

### 1. `src/ocr/extractor.js` - Extracción de datos nutricionales
Funciones:
- `extractNutritionData(imageBuffer, config)`: Extrae datos nutricionales de una imagen usando OCR con IA.
  - **Parámetros**: 
    - `imageBuffer`: Buffer de la imagen (Uint8Array)
    - `config`: { url: string, key: string, model: string }
  - **Retorna**: `Promise<NutritionData[]>` - Array de datos nutricionales extraídos
  - **Ejemplo de salida**:
    ```javascript
    [
      {
        productName: "Barrita de chocolate sin gluten",
        servingSize: "100g",
        energyKj: 2292,
        energyKcal: 549,
        fat: 33,
        saturatedFat: 13,
        carbs: 55,
        sugars: 45,
        fiber: 2.4,
        protein: 6.8,
        salt: 0.18
      }
    ]
    ```

### 2. `src/products/product.js` - Gestión de productos
Funciones:
- `saveProduct(product)`: Guarda un producto en el almacenamiento.
  - **Parámetros**: `product` (Producto)
  - **Retorna**: `Promise<string>` - ID del producto
  - **Ejemplo de entrada**:
    ```javascript
    {
      name: "Barrita de chocolate sin gluten",
      nutritionPer100g: {
        energyKj: 2292,
        energyKcal: 549,
        fat: 33,
        saturatedFat: 13,
        carbs: 55,
        sugars: 45,
        fiber: 2.4,
        protein: 6.8,
        salt: 0.18
      }
    }
    ```
- `getProduct(id)`: Obtiene un producto por ID.
  - **Parámetros**: `id` (string)
  - **Retorna**: `Promise<Producto | null>`
- `listProducts()`: Lista todos los productos.
  - **Retorna**: `Promise<Producto[]>`

### 3. `src/meals/meal.js` - Planificación de comidas
Funciones:
- `createMeal(meal)`: Crea una nueva comida.
  - **Parámetros**: `meal` (Comida)
  - **Retorna**: `Promise<string>` - ID de la comida
- `addProductToMeal(mealId, productId, grams)`: Agrega un producto a una comida con cantidad en gramos.
  - **Parámetros**: 
    - `mealId` (string)
    - `productId` (string)
    - `grams` (number)
  - **Retorna**: `Promise<void>`
- `calculateMealTotals(mealId)`: Calcula los totales nutricionales de una comida.
  - **Parámetros**: `mealId` (string)
  - **Retorna**: `Promise<NutritionTotals>`
  - **Ejemplo de salida**:
    ```javascript
    {
      energyKj: 2292,
      energyKcal: 549,
      fat: 33,
      saturatedFat: 13,
      carbs: 55,
      sugars: 45,
      fiber: 2.4,
      protein: 6.8,
      salt: 0.18
    }
    ```
- `getMeal(mealId)`: Obtiene una comida con sus productos.
  - **Parámetros**: `mealId` (string)
  - **Retorna**: `Promise<Comida>`

### 4. `src/storage/storage.js` - Almacenamiento
Funciones:
- `saveProduct(product)`: Guarda un producto.
- `getProduct(id)`: Obtiene un producto.
- `listProducts()`: Lista productos.
- `saveMeal(meal)`: Guarda una comida.
- `getMeal(id)`: Obtiene una comida.
- `listMeals()`: Lista comidas.

## Modelo de Datos

### Producto
```javascript
{
  id: string,
  name: string,
  nutritionPer100g: {
    energyKj: number,
    energyKcal: number,
    fat: number,
    saturatedFat: number,
    carbs: number,
    sugars: number,
    fiber: number,
    protein: number,
    salt: number
  }
}
```

### Comida
```javascript
{
  id: string,
  name: string,
  products: [
    {
      productId: string,
      productName: string,
      grams: number,
      nutrition: {
        energyKj: number,
        energyKcal: number,
        fat: number,
        saturatedFat: number,
        carbs: number,
        sugars: number,
        fiber: number,
        protein: number,
        salt: number
      }
    }
  ],
  totals: {
    energyKj: number,
    energyKcal: number,
    fat: number,
    saturatedFat: number,
    carbs: number,
    sugars: number,
    fiber: number,
    protein: number,
    salt: number
  }
}
```

## Interfaz de Usuario

### Pantalla 1: Escáner de Productos
- **Acciones del usuario**:
  1. Tomar foto o subir imagen de una tabla nutricional
  2. Ver los datos extraídos
  3. Editar/confirmar los datos
  4. Guardar el producto
- **Funciones llamadas**:
  - `extractNutritionData()` del módulo OCR
  - `saveProduct()` del módulo de productos

### Pantalla 2: Mis Productos
- **Acciones del usuario**:
  1. Ver lista de productos guardados
  2. Buscar productos
  3. Ver detalles de un producto
- **Funciones llamadas**:
  - `listProducts()` del módulo de productos
  - `getProduct()` del módulo de productos

### Pantalla 3: Planificador de Comidas
- **Acciones del usuario**:
  1. Crear una nueva comida
  2. Agregar productos a la comida con cantidad en gramos
  3. Ver totales nutricionales calculados
  4. Guardar la comida
- **Funciones llamadas**:
  - `createMeal()` del módulo de comidas
  - `addProductToMeal()` del módulo de comidas
  - `calculateMealTotals()` del módulo de comidas
  - `getMeal()` del módulo de comidas

### Pantalla 4: Mis Comidas
- **Acciones del usuario**:
  1. Ver lista de comidas guardadas
  2. Ver detalles de una comida
  3. Editar una comida
- **Funciones llamadas**:
  - `listMeals()` del módulo de almacenamiento
  - `getMeal()` del módulo de comidas

## Criterios de Aceptación

### AC-1: Extracción de datos nutricionales
- El usuario puede subir una foto de una tabla nutricional
- El sistema extrae los datos nutricionales (energía, grasas, carbohidratos, azúcares, proteínas, sal)
- Los datos se muestran al usuario para confirmación/edición
- El usuario puede guardar el producto con los datos extraídos

### AC-2: Almacenamiento de productos
- Los productos se almacenan con su información nutricional por 100g
- El usuario puede ver la lista de productos guardados
- El usuario puede ver los detalles de un producto

### AC-3: Planificación de comidas
- El usuario puede crear una nueva comida
- El usuario puede agregar productos a la comida especificando la cantidad en gramos
- El sistema calcula automáticamente los totales nutricionales basados en las cantidades
- El usuario puede ver los totales nutricionales de la comida

### AC-4: Cálculo de totales nutricionales
- Los totales se calculan correctamente proporcionalmente a los gramos agregados
- Se incluyen: energía (kJ y kcal), grasas, grasas saturadas, carbohidratos, azúcares, fibra, proteínas, sal
- Ejemplo: Si un producto tiene 549 kcal por 100g y el usuario agrega 50g, el total debe ser 274.5 kcal

### AC-5: Interfaz de usuario
- La interfaz es simple y limpia
- No hay enfoque en pérdida de peso o salud cardíaca
- Es una herramienta de rastreo nutricional personalizado
- La aplicación es gratuita y sin publicidad

### AC-6: Configuración de IA
- El usuario puede configurar la URL, API Key y modelo del endpoint de IA
- La configuración se guarda en la interfaz de usuario
- Las pruebas no llaman al endpoint de IA (usar datos simulados)

### AC-7: Soporte multilingüe
- El OCR puede extraer datos de tablas nutricionales en diferentes idiomas (alemán, neerlandés, italiano, español, etc.)
- Los campos se normalizan a un formato interno consistente

## Notas de Implementación

### OCR con IA
- El módulo OCR llama a un endpoint OpenAI-compatible
- El usuario configura la URL, API Key y modelo
- Para pruebas, se simula la extracción con datos de ejemplo
- El prompt enviado a la IA debe solicitar la extracción de los campos nutricionales en formato JSON

### Cálculo Nutricional
- Los totales se calculan proporcionalmente: `(grams / 100) * nutritionPer100g`
- Se redondea a 1 decimal para valores en gramos
- Se redondea a entero para energía en kcal

### Almacenamiento
- Para desarrollo: almacenamiento en memoria o localStorage
- Para producción: base de datos (SQLite, PostgreSQL, etc.)