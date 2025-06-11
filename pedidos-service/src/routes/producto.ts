import express, { Request, Response } from "express";
import { 
  crearProducto, 
  listarProductos, 
  listarProductosDisponibles,
  actualizarStockProducto,
  buscarProductoPorId
} from "../metodos";

const router = express.Router();

// GET /productos - Listar todos los productos disponibles
router.get("/", async (req: Request, res: Response) => {
  try {
    const productos = await listarProductosDisponibles();
    res.json({
      success: true,
      data: productos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener productos",
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// GET /productos/restaurante/:restauranteId - Productos por restaurante
router.get("/restaurante/:restauranteId", async (req: Request, res: Response) => {
  try {
    const { restauranteId } = req.params;
    const productos = await listarProductos();
    const productosRestaurante = productos.filter(
      p => p.restaurante.id_restaurante === parseInt(restauranteId)
    );
    
    res.json({
      success: true,
      data: productosRestaurante
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener productos del restaurante",
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// GET /productos/:id - Obtener producto por ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const producto = await buscarProductoPorId(parseInt(id));
    
    if (!producto) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado"
      });
    }
    
    res.json({
      success: true,
      data: producto
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener producto",
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// POST /productos - Crear nuevo producto
router.post("/", async (req: Request, res: Response) => {
  try {
    const nuevoProducto = await crearProducto(req.body);
    res.status(201).json({
      success: true,
      message: "Producto creado exitosamente",
      data: nuevoProducto
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear producto",
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// PUT /productos/:id/stock - Actualizar stock del producto
router.put("/:id/stock", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { cantidad } = req.body;
    
    const productoActualizado = await actualizarStockProducto(parseInt(id), cantidad);
    
    res.json({
      success: true,
      message: "Stock actualizado exitosamente",
      data: productoActualizado
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router;
