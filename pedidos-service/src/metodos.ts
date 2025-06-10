import { AppDataSource } from "./database";
import { MoreThan } from "typeorm";
import { Usuario } from "./models/usuario";
import { Restaurante } from "./models/restaurante";
import { Producto } from "./models/producto";
import { Pedido } from "./models/pedido";
import { Reserva } from "./models/reserva";

// ---------- USUARIO ----------
export const actualizarRestaurante = async (id: number, data: Partial<Restaurante>) => {
  await AppDataSource.getRepository(Restaurante).update(id, data);
  return await buscarRestaurantePorId(id);
};

export const eliminarRestaurante = async (id: number) => {
  await AppDataSource.getRepository(Restaurante).update(id, { activo: false });
  return { message: "Restaurante desactivado" };
};

// ---------- PRODUCTO ----------
export const crearProducto = async (data: Partial<Producto>) => {
  return await AppDataSource.getRepository(Producto).save(data);
};

export const listarProductos = async () => {
  return await AppDataSource.getRepository(Producto).find({ 
    relations: ["restaurante", "reservas"],
    where: { activo: true }
  });
};

export const buscarProductoPorId = async (id: number) => {
  return await AppDataSource.getRepository(Producto).findOne({
    where: { id_producto: id },
    relations: ["restaurante", "reservas"]
  });
};

export const listarProductosDisponibles = async () => {
  return await AppDataSource.getRepository(Producto).find({
    relations: ["restaurante"],
    where: { 
      activo: true, 
      cantidad_disponible: MoreThan(0)
    }
  });
};

export const listarProductosPorRestaurante = async (restauranteId: number) => {
  return await AppDataSource.getRepository(Producto).find({
    relations: ["restaurante"],
    where: { 
      restaurante: { id_restaurante: restauranteId },
      activo: true,
      cantidad_disponible: MoreThan(0)
    }
  });
};

export const actualizarStockProducto = async (id: number, cantidadReservada: number) => {
  const producto = await AppDataSource.getRepository(Producto).findOne({
    where: { id_producto: id }
  });
  
  if (producto && producto.cantidad_disponible >= cantidadReservada) {
    producto.cantidad_disponible -= cantidadReservada;
    return await AppDataSource.getRepository(Producto).save(producto);
  }
  
  throw new Error("Stock insuficiente");
};

export const actualizarProducto = async (id: number, data: Partial<Producto>) => {
  await AppDataSource.getRepository(Producto).update(id, data);
  return await buscarProductoPorId(id);
};

export const eliminarProducto = async (id: number) => {
  await AppDataSource.getRepository(Producto).update(id, { activo: false });
  return { message: "Producto desactivado" };
};

// ---------- PEDIDO ----------
export const crearPedido = async (data: Partial<Pedido>) => {
  return await AppDataSource.getRepository(Pedido).save(data);
};

export const listarPedidos = async () => {
  return await AppDataSource.getRepository(Pedido).find({ 
    relations: ["usuario", "restaurante"],
    order: { fecha_pedido: "DESC" }
  });
};

export const buscarPedidoPorId = async (id: number) => {
  return await AppDataSource.getRepository(Pedido).findOne({
    where: { id_pedido: id },
    relations: ["usuario", "restaurante"]
  });
};

export const listarPedidosPorUsuario = async (usuarioId: number) => {
  return await AppDataSource.getRepository(Pedido).find({
    where: { usuario: { id_usuario: usuarioId } },
    relations: ["restaurante"],
    order: { fecha_pedido: "DESC" }
  });
};

export const actualizarEstadoPedido = async (id: number, estado: string) => {
  await AppDataSource.getRepository(Pedido).update(id, { estado });
  return await buscarPedidoPorId(id);
};

// ---------- RESERVA ----------
export const crearReserva = async (data: Partial<Reserva>) => {
  // Generar código de recogida único
  const codigoRecogida = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  const reservaData = {
    ...data,
    codigo_recogida: codigoRecogida,
    estado_reserva: "pendiente"
  };

  return await AppDataSource.getRepository(Reserva).save(reservaData);
};

export const listarReservas = async () => {
  return await AppDataSource.getRepository(Reserva).find({ 
    relations: ["producto", "usuario", "producto.restaurante"],
    order: { fecha_reserva: "DESC" }
  });
};

export const buscarReservaPorId = async (id: number) => {
  return await AppDataSource.getRepository(Reserva).findOne({
    where: { id_reserva: id },
    relations: ["producto", "usuario", "producto.restaurante"]
  });
};

export const listarReservasPorUsuario = async (usuarioId: number) => {
  return await AppDataSource.getRepository(Reserva).find({
    where: { usuario: { id_usuario: usuarioId } },
    relations: ["producto", "producto.restaurante"],
    order: { fecha_reserva: "DESC" }
  });
};

export const listarReservasPorRestaurante = async (restauranteId: number) => {
  return await AppDataSource.getRepository(Reserva).find({
    where: { producto: { restaurante: { id_restaurante: restauranteId } } },
    relations: ["producto", "usuario"],
    order: { fecha_reserva: "DESC" }
  });
};

export const confirmarReserva = async (id: number) => {
  const reserva = await AppDataSource.getRepository(Reserva).findOne({
    where: { id_reserva: id }
  });
  
  if (reserva) {
    reserva.estado_reserva = "confirmada";
    return await AppDataSource.getRepository(Reserva).save(reserva);
  }
  
  throw new Error("Reserva no encontrada");
};

export const completarReserva = async (id: number, codigoRecogida: string) => {
  const reserva = await AppDataSource.getRepository(Reserva).findOne({
    where: { id_reserva: id, codigo_recogida: codigoRecogida }
  });
  
  if (reserva) {
    reserva.estado_reserva = "completada";
    return await AppDataSource.getRepository(Reserva).save(reserva);
  }
  
  throw new Error("Reserva no encontrada o código incorrecto");
};

export const cancelarReserva = async (id: number) => {
  const reserva = await AppDataSource.getRepository(Reserva).findOne({
    where: { id_reserva: id },
    relations: ["producto"]
  });
  
  if (reserva && reserva.estado_reserva === "pendiente") {
    // Devolver stock al producto
    if (reserva.producto) {
      reserva.producto.cantidad_disponible += reserva.cantidad_reservada;
      await AppDataSource.getRepository(Producto).save(reserva.producto);
    }
    
    reserva.estado_reserva = "cancelada";
    return await AppDataSource.getRepository(Reserva).save(reserva);
  }
  
  throw new Error("No se puede cancelar la reserva");
};

export const crearUsuario = async (data: Partial<Usuario>) => {
  return await AppDataSource.getRepository(Usuario).save(data);
};

export const listarUsuarios = async () => {
  return await AppDataSource.getRepository(Usuario).find({ 
    relations: ["pedidos", "reservas"] 
  });
};

export const buscarUsuarioPorId = async (id: number) => {
  return await AppDataSource.getRepository(Usuario).findOne({
    where: { id_usuario: id },
    relations: ["reservas", "pedidos"]
  });
};

export const buscarUsuarioPorEmail = async (correo: string) => {
  return await AppDataSource.getRepository(Usuario).findOne({ 
    where: { correo },
    relations: ["reservas"]
  });
};

export const actualizarUsuario = async (id: number, data: Partial<Usuario>) => {
  await AppDataSource.getRepository(Usuario).update(id, data);
  return await buscarUsuarioPorId(id);
};

export const eliminarUsuario = async (id: number) => {
  return await AppDataSource.getRepository(Usuario).delete(id);
};

// ---------- RESTAURANTE ----------
export const crearRestaurante = async (data: Partial<Restaurante>) => {
  return await AppDataSource.getRepository(Restaurante).save(data);
};

export const listarRestaurantes = async () => {
  return await AppDataSource.getRepository(Restaurante).find({ 
    relations: ["productos", "pedidos"],
    where: { activo: true }
  });
};

export const buscarRestaurantePorId = async (id: number) => {
  return await AppDataSource.getRepository(Restaurante).findOne({
    where: { id_restaurante: id },
    relations: ["productos"]
  });
};

