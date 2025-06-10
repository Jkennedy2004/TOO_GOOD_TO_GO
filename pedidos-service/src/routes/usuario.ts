import { Router, Request, Response } from "express";
import { 
  crearUsuario, 
  listarUsuarios, 
  buscarUsuarioPorEmail
} from "../../metodos";

const router = Router();

// GET /usuarios - Listar todos los usuarios
router.get("/", async (req: Request, res: Response) => {
  try {
    const usuarios = await listarUsuarios();
    res.json({
      success: true,
      data: usuarios
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener usuarios",
      error: error.message
    });
  }
});

// POST /usuarios - Crear nuevo usuario
router.post("/", async (req: Request, res: Response) => {
  try {
    const { nombre, correo, contraseña, tipo_usuario, telefono } = req.body;
    
    // Validar datos requeridos
    if (!nombre || !correo || !contraseña) {
      return res.status(400).json({
        success: false,
        message: "Faltan datos requeridos: nombre, correo, contraseña"
      });
    }

    // Verificar si el email ya existe
    const usuarioExistente = await buscarUsuarioPorEmail(correo);
    if (usuarioExistente) {
      return res.status(409).json({
        success: false,
        message: "Ya existe un usuario con este correo electrónico"
      });
    }

    const nuevoUsuario = await crearUsuario({
      nombre,
      correo,
      contraseña,
      tipo_usuario: tipo_usuario || "cliente",
      telefono
    });

    // No devolver la contraseña en la respuesta
    const { contraseña: _, ...usuarioSeguro } = nuevoUsuario;
    
    res.status(201).json({
      success: true,
      message: "Usuario creado exitosamente",
      data: usuarioSeguro
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear usuario",
      error: error.message
    });
  }
});

// POST /usuarios/login - Iniciar sesión (básico)
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { correo, contraseña } = req.body;
    
    if (!correo || !contraseña) {
      return res.status(400).json({
        success: false,
        message: "Correo y contraseña son requeridos"
      });
    }

    const usuario = await buscarUsuarioPorEmail(correo);
    
    if (!usuario || usuario.contraseña !== contraseña) {
      return res.status(401).json({
        success: false,
        message: "Credenciales incorrectas"
      });
    }

    if (!usuario.activo) {
      return res.status(403).json({
        success: false,
        message: "Usuario desactivado"
      });
    }

    // No devolver la contraseña
    const { contraseña: _, ...usuarioSeguro } = usuario;
    
    res.json({
      success: true,
      message: "Inicio de sesión exitoso",
      data: usuarioSeguro
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al iniciar sesión",
      error: error.message
    });
  }
});

// GET /usuarios/:id - Obtener usuario por ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const usuarios = await listarUsuarios();
    const usuario = usuarios.find(u => u.id_usuario === parseInt(id));
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    // No devolver la contraseña
    const { contraseña: _, ...usuarioSeguro } = usuario;
    
    res.json({
      success: true,
      data: usuarioSeguro
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener usuario",
      error: error.message
    });
  }
});

export default router;