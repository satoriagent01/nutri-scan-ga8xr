# NutriScan

Una aplicación web gratuita y sin anuncios para el seguimiento de la nutrición. Permite tomar o subir fotos de etiquetas nutricionales de productos, extraer los datos mediante OCR con IA, almacenar la información de los productos y crear comidas personalizadas añadiendo productos con cantidades en gramos, calculando automáticamente el total nutricional.

## Stack

- **Frontend:** `public/` (HTML, CSS, JavaScript vanilla)
- **Backend:** `src/` (Node.js ES modules)
- **OCR con IA:** Módulo configurable (URL, clave API, modelo)

## Cómo ejecutar

### Frontend

El frontend se sirve desde la raíz del repositorio. Necesitas un servidor HTTP porque los navegadores no cargan ES modules desde `file://`.

```bash
npx serve .
```

Luego abre `http://localhost:3000/public/` en tu navegador.

### Backend (módulos)

Los módulos en `src/` son ES modules de Node.js. No se ejecutan como servidor web, pero se pueden importar desde otros scripts Node.

## Configuración del endpoint de IA

En la pantalla de **Configuración** de la app, puedes configurar:

- **URL del endpoint:** La dirección del servicio de OCR/IA (ej: `https://api.openai.com/v1/chat/completions`)
- **Clave API:** Tu clave de API del proveedor
- **Modelo:** El modelo a usar (ej: `gpt-4o`)

Estos valores se guardan en `localStorage` del navegador y se pasan al módulo de OCR.

## Cómo probar

```bash
npm test
```

Ejecuta las pruebas con Node.js (`node --test`).

## Pantallas

1. **Subir foto:** Toma o sube una foto de una etiqueta nutricional. La app extrae los datos con OCR/IA y los muestra para confirmar.
2. **Productos:** Lista todos los productos guardados con su información nutricional por cada 100g.
3. **Comidas:** Crea comidas personalizadas, añade productos con cantidades en gramos y calcula el total nutricional.
4. **Configuración:** Configura el endpoint de IA (URL, clave, modelo).

## Qué no está hecho aún

- La OCR real con IA (actualmente es simulada con texto de ejemplo).
- Almacenamiento persistente (los datos se pierden al recargar la página).
- Servidor backend real (los módulos de `src/` no se ejecutan como API).
- Soporte para múltiples idiomas en la interfaz.