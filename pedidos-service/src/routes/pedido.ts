import { Router, Request, Response } from "express";
import { 
  crearPedido, 
  listarPedidos, 
  listarPedidosPorUsuario,
  buscarPedidoPorId,
  actualizarEstadoPedido
} from "../metodos";

const router = Router();

// GET /pedidos - Listar todos los pedidos
router.get("/", async (req: Request, res: Response) => {
  try {
    const pedidos = await listarPedidos();
    res.json({
      success: true,
      data: pedidos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener pedidos",
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// GET /pedidos/usuario/:usuarioId - Listar pedidos por usuario
router.get("/usuario/:usuarioId", async (req: Request, res: Response) => {
  try {
    const { usuarioId } = req.params;
    const pedidos = await listarPedidosPorUsuario(parseInt(usuarioId));
    
    res.json({
      success: true,
      data: pedidos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener pedidos del usuario",
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// GET /pedidos/:id - Obtener pedido por ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pedido = await buscarPedidoPorId(parseInt(id));
    
    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: "Pedido no encontrado"
      });
    }
    
    res.json({
      success: true,
      data: pedido
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener pedido",
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// POST /pedidos - Crear nuevo pedido
router.post("/", async (req: Request, res: Response) => {
  try {
    const { usuario, restaurante, total, notas } = req.body;
    
    if (!usuario || !restaurante || !total) {
      return res.status(400).json({
        success: false,
        message: "Faltan datos requeridos: usuario, restaurante, total"
      });
    }

    const nuevoPedido = await crearPedido({
      usuario,
      restaurante,
      total,
      notas
    });
    
    res.status(201).json({
      success: true,
      message: "Pedido creado exitosamente",
      data: nuevoPedido
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear pedido",
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// PUT /pedidos/:id/estado - Actualizar estado del pedido
router.put("/:id/estado", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    
    if (!estado) {
      return res.status(400).json({
        success: false,
        message: "Estado es requerido"
      });
    }

    const pedidoActualizado = await actualizarEstadoPedido(parseInt(id), estado);
    
    res.json({
      success: true,
      message: "Estado del pedido actualizado exitosamente",
      data: pedidoActualizado
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router;