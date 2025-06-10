import { Router, Request, Response } from "express";
import { 
  crearRestaurante, 
  listarRestaurantes, 
  buscarRestaurantePorId
} from "../../metodos";

const router = Router();

// GET /restaurantes - Listar todos los restaurantes activos
router.get("/", async (req: Request, res: Response) => {
  try {
    const restaurantes = await listarRestaurantes();
    res.json({
      success: true,
      data: restaurantes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener restaurantes",
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// GET /restaurantes/buscar/cercanos - Buscar restaurantes cercanos
router.get("/buscar/cercanos", async (req: Request, res: Response) => {
  try {
    const { lat, lng, radio = 5 } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "Se requieren las coordenadas lat y lng"
      });
    }

    const restaurantes = await listarRestaurantes();
    
    // Filtrar restaurantes cercanos (implementación básica)
    const restaurantesCercanos = restaurantes.filter(restaurante => {
      if (!restaurante.latitud || !restaurante.longitud) return false;
      
      // Cálculo básico de distancia (en producción usar fórmula haversine)
      const distanciaLat = Math.abs(restaurante.latitud - parseFloat(lat as string));
      const distanciaLng = Math.abs(restaurante.longitud - parseFloat(lng as string));
      const distanciaAproximada = Math.sqrt(distanciaLat ** 2 + distanciaLng ** 2);
      
      return distanciaAproximada <= parseFloat(radio as string) / 100; // Conversión aproximada
    });
    
    res.json({
      success: true,
      data: restaurantesCercanos,
      filtros: {
        latitud: lat,
        longitud: lng,
        radio: radio + " km"
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al buscar restaurantes cercanos",
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// GET /restaurantes/tipo/:tipo - Filtrar por tipo de cocina
router.get("/tipo/:tipo", async (req: Request, res: Response) => {
  try {
    const { tipo } = req.params;
    const restaurantes = await listarRestaurantes();
    
    const restaurantesFiltrados = restaurantes.filter(
      r => r.tipo_cocina.toLowerCase().includes(tipo.toLowerCase())
    );
    
    res.json({
      success: true,
      data: restaurantesFiltrados,
      filtro: `Tipo de cocina: ${tipo}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al filtrar restaurantes por tipo",
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// GET /restaurantes/:id - Obtener restaurante por ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const restaurante = await buscarRestaurantePorId(parseInt(id));
    
    if (!restaurante) {
      return res.status(404).json({
        success: false,
        message: "Restaurante no encontrado"
      });
    }
    
    res.json({
      success: true,
      data: restaurante
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener restaurante",
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// POST /restaurantes - Crear nuevo restaurante
router.post("/", async (req: Request, res: Response) => {
  try {
    const { 
      nombre, 
      direccion, 
      tipo_cocina, 
      horario, 
      telefono, 
      email, 
      latitud, 
      longitud, 
      descripcion,
      imagen_url 
    } = req.body;
    
    // Validar datos requeridos
    if (!nombre || !direccion || !tipo_cocina || !horario) {
      return res.status(400).json({
        success: false,
        message: "Faltan datos requeridos: nombre, direccion, tipo_cocina, horario"
      });
    }

    const nuevoRestaurante = await crearRestaurante({
      nombre,
      direccion,
      tipo_cocina,
      horario,
      telefono,
      email,
      latitud,
      longitud,
      descripcion,
      imagen_url
    });
    
    res.status(201).json({
      success: true,
      message: "Restaurante creado exitosamente",
      data: nuevoRestaurante
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear restaurante",
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router;