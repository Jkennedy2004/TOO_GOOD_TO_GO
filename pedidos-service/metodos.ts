import { AppDataSource } from "./database";
import { Usuario } from "./src/models/usuario";
import { Restaurante } from "./src/models/restaurante";
import { Producto } from "./src/models/producto";
import { Pedido } from "./src/models/pedido";
import { Reserva } from "./src/models/reserva";

// ---------- USUARIO ----------
export const crearUsuario = async (data: Partial<Usuario>) => {
  return await AppDataSource.getRepository(Usuario).save(data);
};

export const listarUsuarios = async () => {
  return await AppDataSource.getRepository(Usuario).find({ 
    relations: ["pedidos", "reservas"] 
  });
};

export const buscarUsuarioPorEmail = async (correo: string) => {
  return await AppDataSource.getRepository(Usuario).findOne({ 
    where: { correo },
    relations: ["reservas"]
  });
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

// ---------- PRODUCTO ----------
export const crearProducto = async (data: Partial<Producto>) => {
  return await AppDataSource.getRepository(Producto).save(data);
};

export const listarProductos = async () => {
  return await AppDataSource.getRepository(Producto).find({ 
    relations: ["restaurante", "reservas"],
    where: { activo: true, cantidad_disponible: MoreThan(0) }
  });
};

export const listarProductosDisponibles = async () => {
  return await AppDataSource.getRepository(Producto)
    .createQueryBuilder("producto")
    .leftJoinAndSelect("producto.restaurante", "restaurante")
    .where("producto.activo = :activo", { activo: true })
    .andWhere("producto.cantidad_disponible > :cantidad", { cantidad: 0 })
    .andWhere("producto.fecha_caducidad >= :fecha", { fecha: new Date() })
    .getMany();
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

// ---------- PEDIDO ----------
export const crearPedido = async (data: Partial<Pedido>) => {
  return await AppDataSource.getRepository(Pedido).save(data);
};

export const listarPedidos = async () => {
  return await AppDataSource.getRepository(Pedido).find({ 
    relations: ["usuario", "restaurante"] 
  });
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

// Helper for TypeORM "MoreThan" operator
function MoreThan(value: number) {
  return { $gt: value };
}
