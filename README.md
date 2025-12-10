# 🖤 Poemas Anónimos

Una mini web minimalista donde cualquier persona puede escribir y compartir poemas de forma completamente anónima.

## ✨ Características

- **Completamente anónimo**: No se pide nombre, email ni ningún dato
- **Diseño minimal**: Fondo crema, tipografía Space Grotesk, estilo limpio y moderno
- **Microinteracciones**: Animaciones suaves al publicar y mostrar poemas
- **Persistencia local**: Los poemas se guardan en localStorage del navegador
- **Responsive**: Se ve perfecto en móvil, tablet y desktop

## 🚀 Deploy en Vercel (Método 1 - Recomendado)

### Opción A: Deploy directo desde GitHub

1. **Subir el código a GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Poemas Anónimos"
   git branch -M main
   git remote add origin TU_REPOSITORIO_URL
   git push -u origin main
   ```

2. **Conectar con Vercel**:
   - Ve a [vercel.com](https://vercel.com)
   - Haz clic en "Add New Project"
   - Importa tu repositorio de GitHub
   - Vercel detectará automáticamente que es un proyecto Vite
   - Haz clic en "Deploy"

3. **¡Listo!** Tu sitio estará en vivo en `https://tu-proyecto.vercel.app`

### Opción B: Deploy con Vercel CLI

1. **Instalar Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Seguir las instrucciones** en la terminal y listo!

## 💻 Desarrollo Local

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Iniciar servidor de desarrollo**:
   ```bash
   npm run dev
   ```

3. **Abrir en el navegador**: `http://localhost:5173`

## 📦 Build para producción

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`.

## 🎨 Personalización

### Colores
Los colores principales están definidos en `src/App.jsx`:
- **Fondo**: `#FDFBF7` (crema)
- **Texto principal**: `#2D3436` (gris oscuro)
- **Texto secundario**: `#636E72` (gris medio)
- **Texto terciario**: `#B2BEC3` (gris claro)
- **Bordes**: `#DFE6E9` (gris muy claro)

### Tipografía
Se usa **Space Grotesk** de Google Fonts. Para cambiarla, modifica la URL en el `<style>` de `App.jsx`.

## 🔧 Estructura del Proyecto

```
poemas-anonimos/
├── src/
│   ├── App.jsx          # Componente principal
│   ├── main.jsx         # Entry point
│   └── index.css        # Estilos base con Tailwind
├── index.html           # HTML principal
├── package.json         # Dependencias
├── vite.config.js       # Config de Vite
├── tailwind.config.js   # Config de Tailwind
└── postcss.config.js    # Config de PostCSS
```

## 📱 Cómo funciona

1. **Landing**: Pantalla inicial con título, subtítulo y botón "Escribir un poema"
2. **Modal**: Al hacer clic, se abre un modal con un textarea
3. **Publicar**: El poema se guarda en localStorage y aparece en la galería
4. **Galería**: Muestra todos los poemas en tarjetas animadas, el más reciente arriba

## ⚠️ Notas Importantes

- **Almacenamiento local**: Los poemas se guardan en el navegador de cada usuario. Si borran los datos del navegador, se pierden los poemas.
- **Sin backend**: Esta versión usa solo localStorage. Para compartir poemas entre usuarios, necesitarías agregar un backend (ver sección siguiente).

## 🚀 Próximos pasos (opcional)

Si quieres que los poemas se compartan entre todos los usuarios:

1. **Backend simple con Vercel**:
   - Crear una API en Vercel Serverless Functions
   - Usar Vercel KV (Redis) para almacenar poemas

2. **Backend con Firebase**:
   - Usar Firestore para guardar poemas
   - Muy fácil de integrar

3. **Backend con Supabase**:
   - Base de datos PostgreSQL gratuita
   - API automática

¿Querés que te ayude a implementar alguna de estas opciones?

## 💝 Filosofía del proyecto

"Un espacio seguro para tus palabras" - este proyecto nació para crear un lugar donde las personas puedan expresarse libremente sin miedo al juicio, sin necesidad de identificarse, y con la belleza de lo simple.

---

Hecho con 🖤 para las palabras que necesitan salir
