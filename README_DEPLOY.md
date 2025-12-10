# 🖤 Poemas Imanes - Con Backend Compartido

Una mini web minimalista tipo "fridge poetry" donde podés crear poemas arrastrando palabras por la pantalla. **Los poemas se comparten entre todos los usuarios de forma anónima en tiempo real.**

## ✨ Características

- **Completamente anónimo**: No se pide nombre, email ni datos
- **Palabras arrastrables**: Drag & drop de palabras por la pantalla
- **Colaborativo**: Todos ven y pueden mover las mismas palabras
- **Tiempo real**: Se actualiza cada 3 segundos automáticamente
- **Diseño limpio**: Fondo con líneas tipo cuaderno, caja centrada

---

## 🚀 Deploy en Vercel (PASO A PASO)

### 1️⃣ Subir a GitHub

```bash
# Inicializar git
git init

# Agregar archivos
git add .

# Commit
git commit -m "Initial commit: Poemas Imanes"

# Crear repo en GitHub y conectar
git branch -M main
git remote add origin https://github.com/TU_USUARIO/poemas-imanes.git
git push -u origin main
```

### 2️⃣ Crear base de datos Vercel KV

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Ve a **Storage** en el menú lateral
3. Haz clic en **Create Database**
4. Selecciona **KV** (Key-Value Store)
5. Dale un nombre (ej: `poemas-imanes-kv`)
6. Haz clic en **Create**

### 3️⃣ Deploy en Vercel

1. En Vercel, haz clic en **Add New Project**
2. Importa tu repositorio de GitHub
3. En la configuración:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Haz clic en **Deploy**

### 4️⃣ Conectar la base de datos

1. Una vez deployado, ve a tu proyecto en Vercel
2. Ve a **Storage** tab
3. Haz clic en **Connect Store**
4. Selecciona tu base de datos KV creada anteriormente
5. Haz clic en **Connect**

### 5️⃣ Redeploy

1. Ve a **Deployments**
2. Haz clic en el menú de los 3 puntos del último deploy
3. Selecciona **Redeploy**
4. Confirma

¡Listo! Tu app está online y funcionando con backend compartido 🎉

---

## 💻 Desarrollo Local

### Requisitos previos
- Node.js v16 o superior
- Cuenta en Vercel (gratis)

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

**Nota:** En desarrollo local, la app funcionará pero usará localStorage en lugar del backend compartido. Para probar el backend compartido, necesitas deployar a Vercel.

---

## 🎨 Cómo funciona

### Frontend (React)
- Carga las palabras desde la API al iniciar
- Se actualiza cada 3 segundos para ver cambios de otros usuarios
- Permite agregar, mover y eliminar palabras

### Backend (Vercel Serverless Functions)
- `api/palabras.js`: GET (obtener), POST (agregar), DELETE (eliminar)
- `api/actualizar-posicion.js`: PUT (actualizar posición cuando arrastras)

### Base de datos (Vercel KV)
- Redis-compatible key-value store
- Gratis hasta 256MB de datos
- Todas las palabras se guardan en una key llamada `palabras`

---

## 📁 Estructura del proyecto

```
poemas-imanes/
├── api/
│   ├── palabras.js              # CRUD de palabras
│   └── actualizar-posicion.js   # Actualizar posiciones
├── src/
│   ├── App.jsx                  # Componente principal
│   ├── main.jsx                 # Entry point
│   └── index.css                # Estilos base
├── index.html
├── package.json
├── vite.config.js
├── vercel.json                  # Config de Vercel
└── README_DEPLOY.md             # Este archivo
```

---

## 🔧 Configuración de Vercel KV

Las variables de entorno se configuran automáticamente cuando conectas el KV Store en Vercel:

- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`
- `KV_URL`

**No necesitas configurar nada manualmente**, Vercel lo hace por ti.

---

## ⚙️ Variables de entorno (opcional)

Si querés desarrollar localmente con el backend:

1. Instala Vercel CLI: `npm i -g vercel`
2. Ejecuta: `vercel env pull`
3. Esto descargará las env vars a `.env.local`
4. Ejecuta: `vercel dev` (en lugar de `npm run dev`)

---

## 🆓 Límites del plan gratuito

### Vercel:
- Unlimited requests
- 100GB bandwidth/mes
- Serverless Functions incluidas

### Vercel KV:
- 256MB de storage
- 100K comandos/mes
- Perfecto para este proyecto

---

## 🐛 Solución de problemas

### "Error conectando con la API"
- Asegúrate de haber conectado el KV Store en Vercel
- Redeploya el proyecto después de conectar el KV

### "Las palabras no se comparten entre usuarios"
- Verifica que el KV Store esté conectado
- Revisa los logs en Vercel Dashboard → Functions

### "Build failed"
- Asegúrate de que `@vercel/kv` esté en `package.json`
- Verifica que los archivos en `/api` estén commiteados

---

## 🎯 Roadmap (futuras mejoras)

- [ ] WebSockets para actualizaciones en tiempo real (sin polling)
- [ ] Colores diferentes por usuario
- [ ] Historial de cambios
- [ ] Modo privado (canvas personales)
- [ ] Export como imagen

---

## 💬 Soporte

Si tenés problemas:
1. Revisa los logs en Vercel Dashboard
2. Verifica que el KV Store esté conectado
3. Asegúrate de haber redeployado después de conectar el KV

---

## 📝 Licencia

MIT - Usalo como quieras, modificalo, compartilo

---

**¡Disfrutá creando poemas colaborativos!** 🎨✨
