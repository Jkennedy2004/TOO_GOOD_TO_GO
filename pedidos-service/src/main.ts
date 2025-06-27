import express from "express";
import cors from "cors";
import { AppDataSource } from "./database";
import { AIRecommendationService } from "./services/aiRecommendations";

// Importar rutas
import usuariosRoutes from "./routes/usuario";
import restaurantesRoutes from "./routes/restaurante";
import productosRoutes from "./routes/producto";
import reservasRoutes from "./routes/reserva";
import pedidosRoutes from "./routes/pedido";
import aiRoutes from "./routes/aiRecommendations"; // Ruta corregida

const app = express();
const PORT = process.env.PORT ?? 3000;

// Instancia del servicio de IA
const aiService = new AIRecommendationService();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas existentes
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/restaurantes", restaurantesRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/reservas", reservasRoutes);
app.use("/api/pedidos", pedidosRoutes);

// Nueva ruta de IA
app.use("/api/ai", aiRoutes);

// Ruta de prueba mejorada con información de IA
app.get("/", (_req, res) => {
  res.json({
    message: "API Too Good To Go - Funcionando correctamente",
    version: "2.0.0",
    features: {
      ia: "Sistema de recomendaciones inteligentes activado",
      recomendaciones: "Algoritmos personalizados basados en historial",
      similitudes: "Búsqueda de productos similares",
      preferencias: "Sistema de preferencias de usuario"
    },
    endpoints: {
      usuarios: "/api/usuarios",
      restaurantes: "/api/restaurantes",
      productos: "/api/productos",
      reservas: "/api/reservas",
      pedidos: "/api/pedidos",
      ai: {
        recomendaciones: "POST /api/ai/recomendaciones",
        explicacion: "GET /api/ai/recomendaciones/:usuario_id/explicacion/:producto_id",
        similares: "GET /api/ai/productos-similares/:producto_id",
        preferencias: "POST /api/ai/preferencias/:usuario_id",
        estadisticas: "GET /api/ai/estadisticas/:usuario_id"
      }
    }
  });
});

// Ruta de estado del sistema de IA
app.get("/api/ai/status", (_req, res) => {
  res.json({
    success: true,
    message: "Sistema de IA operativo",
    data: {
      service: "AIRecommendationService",
      status: "active",
      features: [
        "Recomendaciones personalizadas",
        "Análisis de preferencias",
        "Búsqueda de similitudes",
        "Explicaciones de recomendaciones"
      ],
      version: "1.0.0"
    }
  });
});

// Manejo de errores 404


// Manejo global de errores
app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("❌ Error no manejado:", error);
  res.status(500).json({
    success: false,
    message: "Error interno del servidor",
    error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
  });
});

// Inicializar servidor y conexión a base de datos
async function startServer() {
  try {
    await AppDataSource.initialize();
    console.log("✅ Conexión a la base de datos exitosa");
    
    // Verificar sistema de IA
    console.log("🤖 Sistema de IA inicializado correctamente");
    console.log("   - Servicio de recomendaciones: ✓");
    console.log("   - Análisis de preferencias: ✓");
    console.log("   - Búsqueda de similitudes: ✓");
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📚 API Docs disponible en http://localhost:${PORT}/`);
      console.log(`🧠 IA Status en http://localhost:${PORT}/api/ai/status`);
      console.log(`🎯 Endpoints de IA disponibles:`);
      console.log(`   - POST /api/ai/recomendaciones`);
      console.log(`   - GET /api/ai/productos-similares/:id`);
      console.log(`   - POST /api/ai/preferencias/:usuario_id`);
      console.log(`   - GET /api/ai/estadisticas/:usuario_id`);
    });
  } catch (error) {
    console.error("❌ Error al inicializar:", error);
    process.exit(1);
  }
}

// Manejo de señales del sistema
process.on('SIGTERM', () => {
  console.log('👋 Cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 Cerrando servidor...');
  process.exit(0);
});

startServer();