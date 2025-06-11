import express, { Request, Response } from "express";
import { 
  crearUsuario, 
  listarUsuarios, 
  buscarUsuarioPorEmail,
  buscarUsuarioPorId
} from "../metodos";

const router = express.Router();

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
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const usuario = await buscarUsuarioPorId(parseInt(id));
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    const { contraseña: _, ...usuarioSeguro } = usuario;
    
    res.json({
      success: true,
      data: usuarioSeguro
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener usuario",
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { nombre, correo, contraseña, tipo_usuario, telefono } = req.body;
    
    if (!nombre || !correo || !contraseña) {
      return res.status(400).json({
        success: false,
        message: "Faltan datos requeridos: nombre, correo, contraseña"
      });
    }

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
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

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
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router;
