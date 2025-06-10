import express, { Request, Response, Router } from "express";
import { 
  crearReserva, 
  listarReservas, 
  listarReservasPorUsuario,
  confirmarReserva,
  completarReserva,
  actualizarStockProducto
} from "../../metodos";

const router = Router();

// GET /reservas - Listar todas las reservas
router.get("/", async (req: Request, res: Response) => {
  try {
    const reservas = await listarReservas();
    res.json({ success: true, data: reservas });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener reservas",
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// GET /reservas/usuario/:usuarioId - Listar reservas por usuario
router.get("/usuario/:usuarioId", async (req: Request, res: Response) => {
  try {
    const { usuarioId } = req.params;
    const reservas = await listarReservasPorUsuario(parseInt(usuarioId));
    res.json({ success: true, data: reservas });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener reservas del usuario",
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// PUT /reservas/:id/confirmar - Confirmar reserva
router.put("/:id/confirmar", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const reservaConfirmada = await confirmarReserva(parseInt(id));
    res.json({
      success: true,
      message: "Reserva confirmada exitosamente",
      data: reservaConfirmada
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

// PUT /reservas/:id/completar - Completar reserva con código
router.put("/:id/completar", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { codigo } = req.body;
    if (!codigo) {
      return res.status(400).json({ success: false, message: "Falta el código para completar la reserva" });
    }
    const reservaCompletada = await completarReserva(parseInt(id), codigo);
    res.json({
      success: true,
      message: "Reserva completada exitosamente",
      data: reservaCompletada
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

// GET /reservas/:id - Obtener reserva por ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const reservas = await listarReservas();
    const reserva = reservas.find(r => r.id_reserva === parseInt(id));
    if (!reserva) {
      return res.status(404).json({ success: false, message: "Reserva no encontrada" });
    }
    res.json({ success: true, data: reserva });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener reserva",
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// POST /reservas - Crear nueva reserva
router.post("/", async (req: Request, res: Response) => {
  try {
    const { producto_id, usuario_id, cantidad_reservada, fecha_recogida } = req.body;
    if (!producto_id || !usuario_id || !cantidad_reservada || !fecha_recogida) {
      return res.status(400).json({
        success: false,
        message: "Faltan datos requeridos: producto_id, usuario_id, cantidad_reservada, fecha_recogida"
      });
    }

    // Precio total temporal (mejor obtener desde DB)
    const precio_total = req.body.precio_total || 0;

    const usuarioCompleto = {
      id_usuario: usuario_id,
      nombre: "",
      correo: "",
      contraseña: "",
      tipo_usuario: "",
      telefono: "",
      direccion: "",
      fecha_registro: new Date(),
      activo: true,
      pedidos: [],
      reservas: []
    };

    const datosReserva = {
      producto: { id_producto: producto_id },
      usuario: usuarioCompleto,
      cantidad_reservada,
      fecha_recogida: new Date(fecha_recogida),
      precio_total
    };

    const nuevaReserva = await crearReserva(datosReserva);
    await actualizarStockProducto(producto_id, cantidad_reservada);

    res.status(201).json({
      success: true,
      message: "Reserva creada exitosamente",
      data: nuevaReserva
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear reserva",
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router;
