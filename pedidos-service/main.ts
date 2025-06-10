import express from "express";
import cors from "cors";
import { AppDataSource } from "./database";

// Importar rutas
import usuariosRoutes from "./src/routes/usuario";
import restaurantesRoutes from "./src/routes/restaurante";
import productosRoutes from "./src/routes/producto";
import reservasRoutes from "./src/routes/reserva";

const app = express();
const PORT = process.env.PORT ?? 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/restaurantes", restaurantesRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/reservas", reservasRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    message: "API Too Good To Go - Funcionando correctamente",
    version: "1.0.0",
    endpoints: {
      usuarios: "/api/usuarios",
      restaurantes: "/api/restaurantes",
      productos: "/api/productos",
      reservas: "/api/reservas"
    }
  });
});

// Manejo de errores 404
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint no encontrado"
  });
});

// Inicializar servidor y conexión a base de datos
async function startServer() {
  try {
    await AppDataSource.initialize();
    console.log("✅ Conexión a la base de datos exitosa");
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📚 API Docs disponible en http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.error("❌ Error al inicializar:", error);
    process.exit(1);
  }
}

startServer();
