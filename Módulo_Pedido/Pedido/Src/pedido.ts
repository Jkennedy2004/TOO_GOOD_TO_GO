import { Producto } from "./Producto";

export class Pedido {
  id: number;
  usuarioId: number;
  restauranteId: number;
  productos: Producto[];
  total: number;
  fecha: Date;

  constructor(
    id: number,
    usuarioId: number,
    restauranteId: number,
    productos: Producto[],
    total: number,
    fecha: Date
  ) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.restauranteId = restauranteId;
    this.productos = productos;
    this.total = total;
    this.fecha = fecha;
  }
}
