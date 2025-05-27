export class HistorialDesperdicio {
    id: number;
    restauranteId: number;
    productoId: number;
    cantidadDesperdiciada: number;
    fecha: Date;
  
    constructor(
      id: number,
      restauranteId: number,
      productoId: number,
      cantidadDesperdiciada: number,
      fecha: Date
    ) {
      this.id = id;
      this.restauranteId = restauranteId;
      this.productoId = productoId;
      this.cantidadDesperdiciada = cantidadDesperdiciada;
      this.fecha = fecha;
    }
  }
  