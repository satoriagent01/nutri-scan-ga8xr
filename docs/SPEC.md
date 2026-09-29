# NutriScan - Especificación del Producto

## 1. Visión General

NutriScan es una aplicación web gratuita y sin publicidad que permite a los usuarios rastrear su ingesta nutricional de forma personalizada. La app utiliza OCR con IA para extraer información de las tablas nutricionales de productos alimenticios a partir de fotos, y luego permite al usuario crear comidas personalizadas sumando productos con cantidades en gramos, calculando automáticamente los totales nutricionales.

## 2. Ejemplos de las imágenes compartidas

### Imagen 1 (1.jpg) - Chocolate sin gluten (Dr. Schär AG)
- **Idioma**: Multilingüe (alemán, francés, neerlandés, italiano, inglés)
- **Tabla nutricional por 100g y por porción (30g = 1 Melto)**:
  - Energía: 2292 kJ / 549 kcal (por 100g), 688 kJ / 165 kcal (por 30g)
  - Grasas (Fett/matières grasses/vetten/grassi): 33g (100g), 10g (30g)
  - De las cuales saturadas (davon gesättigte Fettsäuren): 13g (100g), 3.9g (30g)
  - Carbohidratos (Kohlenhydrate/glucides/koolhydraten/carboidrati): 55g (100g), 16g (30g)
  - De los cuales azúcares (davon Zucker/dont sucres): 45g (100g), 14g (30g)
  - Fibra (Ballaststoffe/fibres alimentaires/vezels/fibre): 2.4g (100g), 0.7g (30g)
  - Proteínas (Eiweiß/protéines/eiwitten/proteine): 6.8g (100g), 2.0g (30g)
  - Sal (Salz/sel/zout/sale): 0.18g (100g), 0.05g (30g)
- **Ingredientes**: Pâte de noisettes 57%, sucre, huiles végétales (palme, tournesol), noisettes 20%, lactose, lait entier en poudre, lait entier en poudre, arôme naturel de vanille, émulsifiant: lécithine de soja, arôme naturel vanille), gaufrette sans gluten (farine de riz, amidón de maïs, huile de palme, émulsifiant: lécithine de tournesol), poudre à lever: carbonate acide de sodium, carbonate acide d'ammonium), chocolat noir 7.5% (pâte de cacao*, sucre, beurre de cacao*, émulsifiant: lécithine de soja, arôme naturel de vanille).
- **Alergias**: Contiene nueces (almendras, nueces, pistachos). Sin gluten.

### Imagen 2 (2.jpg) - Zumo de manzana-naranja-mango
- **Idioma**: Neerlandés
- **Tabla nutricional por 100ml y por vaso (200ml)**:
  - Energía: 199 kJ / 47 kcal (100ml), 399 kJ / 94 kcal (200ml)
  - Grasas: 0g (ambas columnas)
  - De las cuales saturadas: 0g (ambas columnas)
  - Carbohidratos: 11g (100ml), 22g (200ml)
  - De los cuales azúcares: 10g (100ml), 20g (200ml)
  - Miel: 0.7g (100ml), 1.4g (200ml)
  - Proteínas: 0.4g (100ml), 0.8g (200ml)
  - Sal: 0g (ambas columnas)
  - Vitamina C: 26% (100ml), 21mg (200ml)
- **Ingredientes**: 45% manzana, 35% naranja, 20% mango, antioxidante (ascorbina [E300]). Sin azúcares añadidos.
- **Alergias**: Sin gluten, sin lactosa.
- **Porciones**: 5 porciones de 200ml por 1L.

### Imagen 3 (3.jpg) - Aceite de oliva en spray
- **Idioma**: Neerlandés
- **Tabla nutricional por 100ml**:
  - Energía: 3404 kJ / 828 kcal
  - Grasas: 92g
  - De las cuales saturadas: 14g
  - Carbohidratos: 0g
  - De los cuales azúcares: 0g
  - Proteínas: 0g
  - Sal: 0g
  - Vitamina E: 150% (8mg)
- **Ingredientes**: Aceite de oliva extra virgen.
- **Alergias**: Sin información de alergias.
- **Referencia diaria**: 8400 kJ / 2000 kcal.

## 3. Stack Tecnológico

- **Frontend (UI)**: `public/` - Aplicación web (HTML/CSS/JS o framework ligero como Vue.js/React).
- **Backend (Lógica)**: `src/` - Servidor backend (Node.js/Express o similar).
- **Módulo de OCR con IA**: `src/ocr/` - Módulo que llama a un endpoint OpenAI-compatible configurado por el usuario.
- **Base de datos**: SQLite o archivo JSON para almacenamiento local (sin backend pesado).

### Estructura del proyecto:
```
nutri-scan-ga8xr/
├── docs/
│   └── SPEC.md
├── public/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── app.js
│       ├── ocr.js
│       ├── products.js
│       └── meals.js
├── src/
│   ├── server.js
│   ├── ocr/
│   │   └── ocr.js
│   ├── models/
│   │   └── product.js
│   └── utils/
│       └── nutrition.js
└── data/
    └── products.json
```

## 4. Módulos de la Lógica

### 4.1 Módulo OCR (`src/ocr/ocr.js`)

**Función principal**: `extractNutrition(imageBuffer: Buffer, config: { url: string, key: string, model: string }) => Promise<NutritionData[]>`

- **Parámetros**:
  - `imageBuffer`: Buffer de la imagen (foto de la etiqueta nutricional).
  - `config`: Configuración del endpoint OpenAI-compatible:
    - `url`: URL del endpoint (ej: `https://api.openai.com/v1/chat/completions`).
    - `key`: Clave API.
    - `model`: Modelo a usar (ej: `gpt-4-vision-preview`).
- **Retorna**: `Promise<NutritionData[]>` - Array de objetos con la información nutricional extraída.
- **Async**: Sí.
- **Ejemplo de entrada**: Buffer de imagen de la etiqueta del chocolate (Imagen 1).
- **Ejemplo de salida**:
  ```json
  [
    {
      "productName": "Barres enrobées de chocolat au lait fourrées à la crème à la noisette sans gluten",
      "nutritionPer100g": {
        "energyKj": 2292,
        "energyKcal": 549,
        "fat": 33,
        "saturatedFat": 13,
        "carbs": 55,
        "sugars": 45,
        "fiber": 2.4,
        "protein": 6.8,
        "salt": 0.18
      },
      "nutritionPerServing": {
        "servingSize": "30g",
        "energyKj": 688,
        "energyKcal": 165,
        "fat": 10,
        "saturatedFat": 3.9,
        "carbs": 16,
        "sugars": 14,
        "fiber": 0.7,
        "protein": 2.0,
        "salt": 0.05
      },
      "ingredients": "pâte de noisettes 57%, sucre, huiles végétales...",
      "allergens": ["nueces", "gluten"]
    }
  ]
  ```

### 4.2 Módulo de Productos (`src/models/product.js`)

**Funciones**:
- `saveProduct(product: Product) => void`
  - Guarda un producto en la base de datos (archivo JSON o SQLite).
  - **Parámetros**: `product` - Objeto producto con todos sus campos.
  - **Retorna**: `void`.
  - **Async**: No (sincrono para archivo JSON, async para SQLite).

- `getProduct(id: string) => Product | null`
  - Obtiene un producto por su ID.
  - **Parámetros**: `id` - ID del producto.
  - **Retorna**: `Product` o `null` si no existe.
  - **Async**: No.

- `getAllProducts() => Product[]`
  - Obtiene todos los productos guardados.
  - **Retorna**: `Product[]`.
  - **Async**: No.

- `deleteProduct(id: string) => boolean`
  - Elimina un producto por su ID.
  - **Parámetros**: `id` - ID del producto.
  - **Retorna**: `boolean` - `true` si se eliminó, `false` si no existía.
  - **Async**: No.

### 4.3 Módulo de Nutrición (`src/utils/nutrition.js`)

**Funciones**:

- `calculateNutritionPerGrams(nutritionPer100g: NutritionValues, grams: number) => NutritionValues`
  - Calcula la nutrición para una cantidad dada en gramos, basado en los valores por 100g.
  - **Parámetros**:
    - `nutritionPer100g`: Objeto con valores nutricionales por 100g.
    - `grams`: Cantidad en gramos.
  - **Retorna**: `NutritionValues` - Objeto con los valores nutricionales para esa cantidad.
  - **Ejemplo**:
    - Entrada: `{ energyKj: 2292, energyKcal: 549, fat: 33, saturatedFat: 13, carbs: 55, sugars: 45, fiber: 2.4, protein: 6.8, salt: 0.18 }`, `grams: 30`
    - Salida: `{ energyKj: 687.6, energyKcal: 164.7, fat: 9.9, saturatedFat: 3.9, carbs: 16.5, sugars: 13.5, fiber: 0.72, protein: 2.04, salt: 0.054 }`

- `sumNutrition(nutritionArray: NutritionValues[]) => NutritionValues`
  - Suma los valores nutricionales de un array de objetos.
  - **Parámetros**: `nutritionArray` - Array de objetos `NutritionValues`.
  - **Retorna**: `NutritionValues` - Objeto con la suma total.
  - **Ejemplo**:
    - Entrada: `[{ energyKj: 687.6, ... }, { energyKj: 199, ... }]`
    - Salida: `{ energyKj: 886.6, ... }`

## 5. Modelo de Datos

### Producto (`Product`)
```json
{
  "id": "string (UUID)",
  "name": "string",
  "nutritionPer100g": {
    "energyKj": "number",
    "energyKcal": "number",
    "fat": "number",
    "saturatedFat": "number",
    "carbs": "number",
    "sugars": "number",
    "fiber": "number",
    "protein": "number",
    "salt": "number"
  },
  "ingredients": "string (opcional)",
  "allergens": ["string"] (opcional),
  "createdAt": "string (ISO date)"
}
```

### Comida (`Meal`)
```json
{
  "id": "string (UUID)",
  "name": "string",
  "items": [
    {
      "productId": "string",
      "productName": "string",
      "grams": "number",
      "nutrition": "NutritionValues"
    }
  ],
  "totalNutrition": "NutritionValues",
  "createdAt": "string (ISO date)"
}
```

## 6. Interfaz de Usuario

### Pantalla 1: Escáner de Etiquetas (`/`)
- **Qué hace el usuario**:
  1. Sube o toma una foto de la etiqueta nutricional de un producto.
  2. La app procesa la imagen con OCR y muestra los datos extraídos.
  3. El usuario puede editar los datos si es necesario.
  4. Guarda el producto en su biblioteca.
- **Funciones llamadas**:
  - `extractNutrition(imageBuffer, config)` del módulo OCR.
  - `saveProduct(product)` del módulo de Productos.

### Pantalla 2: Biblioteca de Productos (`/products`)
- **Qué hace el usuario**:
  1. Ve la lista de todos los productos guardados.
  2. Puede buscar productos por nombre.
  3. Puede eliminar productos.
  4. Puede ver los detalles de un producto (nutrición por 100g, ingredientes, alérgenos).
- **Funciones llamadas**:
  - `getAllProducts()` del módulo de Productos.
  - `getProduct(id)` del módulo de Productos.
  - `deleteProduct(id)` del módulo de Productos.

### Pantalla 3: Planificador de Comidas (`/meals`)
- **Qué hace el usuario**:
  1. Crea una nueva comida (le pone un nombre).
  2. Añade productos de su biblioteca con una cantidad en gramos.
  3. La app calcula automáticamente la nutrición total de la comida.
  4. Puede ver el desglose de cada producto y el total.
  5. Puede guardar la comida.
- **Funciones llamadas**:
  - `calculateNutritionPerGrams(nutritionPer100g, grams)` del módulo de Nutrición.
  - `sumNutrition(nutritionArray)` del módulo de Nutrición.

### Pantalla 4: Configuración (`/settings`)
- **Qué hace el usuario**:
  1. Configura el endpoint de OCR (URL, clave API, modelo).
  2. Puede ver la lista de productos guardados y su almacenamiento.
- **Funciones llamadas**:
  - Ninguna función de lógica, solo configuración de la UI.

## 7. Criterios de Aceptación

### AC-1: Extracción de datos nutricionales con OCR
- **Descripción**: El usuario puede subir una foto de una etiqueta nutricional y la app extrae correctamente los datos nutricionales (energía, grasas, carbohidratos, azúcares, proteínas, sal) por 100g y por porción.
- **Prueba**: Subir la Imagen 1 (chocolate Dr. Schär) y verificar que se extraen correctamente los valores: energía 2292 kJ / 549 kcal por 100g, grasas 33g, carbohidratos 55g, etc.

### AC-2: Almacenamiento de productos
- **Descripción**: Los productos extraídos se guardan en la biblioteca del usuario con todos sus datos (nombre, nutrición por 100g, ingredientes, alérgenos).
- **Prueba**: Guardar un producto extraído y verificar que aparece en la lista de productos con todos sus campos.

### AC-3: Cálculo de nutrición por gramos
- **Descripción**: Al añadir un producto a una comida con una cantidad en gramos, la app calcula correctamente la nutrición para esa cantidad.
- **Prueba**: Añadir 30g del chocolate (Imagen 1) y verificar que la nutrición calculada es: energía 687.6 kJ / 164.7 kcal, grasas 9.9g, carbohidratos 16.5g, etc.

### AC-4: Suma de nutrición total de la comida
- **Descripción**: La app suma correctamente la nutrición de todos los productos añadidos a una comida.
- **Prueba**: Añadir 30g del chocolate (Imagen 1) y 200ml del zumo (Imagen 2, equivalente a 200g aprox.) y verificar que la suma total es correcta.

### AC-5: Interfaz de usuario limpia y funcional
- **Descripción**: La app tiene una interfaz simple, limpia y fácil de usar, sin publicidad ni enfoque en pérdida de peso o salud cardíaca.
- **Prueba**: Verificar que la UI no tiene anuncios, no menciona pérdida de peso ni salud cardíaca, y es intuitiva.

### AC-6: Configuración del endpoint OCR
- **Descripción**: El usuario puede configurar el endpoint de OCR (URL, clave API, modelo) en la pantalla de configuración.
- **Prueba**: Configurar un endpoint OpenAI-compatible y verificar que se usa para extraer datos de las etiquetas.

### AC-7: Búsqueda de productos
- **Descripción**: El usuario puede buscar productos en su biblioteca por nombre.
- **Prueba**: Buscar "chocolate" y verificar que aparece el producto Dr. Schär.

### AC-8: Eliminación de productos
- **Descripción**: El usuario puede eliminar productos de su biblioteca.
- **Prueba**: Eliminar un producto y verificar que ya no aparece en la lista.

### AC-9: Visualización de detalles del producto
- **Descripción**: El usuario puede ver los detalles de un producto (nutrición por 100g, ingredientes, alérgenos).
- **Prueba**: Abrir los detalles del chocolate y verificar que se muestran todos los campos.

### AC-10: Gratis y sin publicidad
- **Descripción**: La app es gratuita y no tiene publicidad.
- **Prueba**: Verificar que no hay anuncios en ninguna pantalla.