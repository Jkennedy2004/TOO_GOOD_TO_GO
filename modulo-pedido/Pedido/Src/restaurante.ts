export class Restaurante {
    id: number;
    nombre: string;
    direccion: string;
    tipoComida: string;
  
    constructor(id: number, nombre: string, direccion: string, tipoComida: string) {
      this.id = id;
      this.nombre = nombre;
      this.direccion = direccion;
      this.tipoComida = tipoComida;
    }
  }
  