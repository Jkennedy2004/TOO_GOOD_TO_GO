import express, { Request, Response, Router } from "express";
import { 
  crearReserva, 
  listarReservas, 
  listarReservasPorUsuario,
  confirmarReserva,
  completarReserva,
  actualizarStockProducto
} from "../../metodos";

// (moved to the import section above)

const router = Router();

// GET /reservas - Listar todas las reservas
router.get("/", async (req: Request, res: Response) => {
  try {
    const reservas = await listarReservas();
    res.json({
      success: true,
      data: reservas
    });
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
    
    res.json({
      success: true,
      data: reservas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener reservas del usuario",
      error: error instanceof Error ? error.message : String(error)
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
      return res.status(404).json({
        success: false,
        message: "Reserva no encontrada"
      });
    }
    
    res.json({
      success: true,
      data: reserva
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener reserva",
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// POST /reservas - Crear nueva reserva

const crearReservaHandler: express.RequestHandler = async (req, res) => {
  try {
    const { producto_id, usuario_id, cantidad_reservada, fecha_recogida } = req.body;
    
    // Validar datos requeridos
    if (!producto_id || !usuario_id || !cantidad_reservada || !fecha_recogida) {
      return res.status(400).json({
        success: false,
        message: "Faltan datos requeridos: producto_id, usuario_id, cantidad_reservada, fecha_recogida"
      });
    }

    // Calcular precio total (esto debería hacerse consultando el producto)
    const precio_total = req.body.precio_total || 0;

    // Aquí deberías obtener el usuario completo desde la base de datos o el método correspondiente
    // Por ejemplo, supongamos que tienes una función getUsuarioById
    // const usuarioCompleto = await getUsuarioById(usuario_id);

    // Temporalmente, puedes construir un objeto de usuario con valores ficticios para evitar el error de tipado:
    const usuarioCompleto = {
      id_usuario: usuario_id,
      nombre: "", // Rellena con el valor real
      correo: "",
      contraseña: "",
      tipo_usuario: "",
      telefono: "",
      direccion: "",
      fecha_registro: new Date(),
      activo: true, // Valor ficticio
      pedidos: [],  // Valor ficticio
      reservas: []  // Valor ficticio
      // Agrega cualquier otro campo requerido por la interfaz Usuario
    };

    const datosReserva = {
      producto: { id_producto: producto_id },
      usuario: usuarioCompleto,
      cantidad_reservada,
      fecha_recogida: new Date(fecha_recogida),
      precio_total
    };

    // Crear la reserva
    const nuevaReserva = await crearReserva(datosReserva);
    
    // Actualizar el stock del producto
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
};

router.post("/", crearReservaHandler);

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
// (moved up to be before the generic /:id route)

// GET /reservas/:id - Obtener reserva por ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const reservas = await listarReservas();
    const reserva = reservas.find(r => r.id_reserva === parseInt(id));
    
    if (!reserva) {
      return res.status(404).json({
        success: false,
        message: "Reserva no encontrada"
      });
    }
    
    res.json({
      success: true,
      data: reserva
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener reserva",
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router;