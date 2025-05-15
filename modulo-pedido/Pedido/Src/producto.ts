export class Producto {
    id: number;
    nombre: string;
    precio: number;
    cantidad: number;
  
    constructor(id: number, nombre: string, precio: number, cantidad: number) {
      this.id = id;
      this.nombre = nombre;
      this.precio = precio;
      this.cantidad = cantidad;
    }
  }
  