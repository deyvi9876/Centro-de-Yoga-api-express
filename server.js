// ...existing code...
const express = require('express');
const cors = require('cors');

const instructorsRoutesImport = require('./src/routes/instructors.routes');
const classesRoutesImport = require('./src/routes/classes.routes');
const enrollmentsRoutesImport = require('./src/routes/enrollments.routes');

function resolveRouter(mod) {
  if (!mod) return mod;
  // compatibilidad CommonJS (module.exports = router), ESM (export default) y { router }
  return mod.default || mod.router || mod;
}

const instructorsRoutes = resolveRouter(instructorsRoutesImport);
const classesRoutes = resolveRouter(classesRoutesImport);
const enrollmentsRoutes = resolveRouter(enrollmentsRoutesImport);

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json()); // bodyParser ya está integrado en Express

// Verificación (para detectar cuál ruta falla)
console.log('instructorsRoutes tipo:', typeof instructorsRoutes);
console.log('classesRoutes tipo:', typeof classesRoutes);
console.log('enrollmentsRoutes tipo:', typeof enrollmentsRoutes);

// Asegurarse de que son routers/middlewares antes de registrarlos
if (typeof instructorsRoutes !== 'function') {
  throw new TypeError('instructors.routes debe exportar un router (module.exports = router). Revisar ./src/routes/instructors.routes');
}
if (typeof classesRoutes !== 'function') {
  throw new TypeError('classes.routes debe exportar un router (module.exports = router). Revisar ./src/routes/classes.routes');
}
if (typeof enrollmentsRoutes !== 'function') {
  throw new TypeError('enrollments.routes debe exportar un router (module.exports = router). Revisar ./src/routes/enrollments.routes');
}

// Rutas (routing modular)
app.use('/api/instructors', instructorsRoutes);
app.use('/api/classes', classesRoutes);
app.use('/api/enrollments', enrollmentsRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ message: 'API Centro de Yoga - Routing Avanzado' });
});

// Error handler básico
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
// ...existing code...