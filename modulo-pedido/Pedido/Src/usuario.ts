export class Usuario {
    id: number;
    nombre: string;
    correo: string;
    direccion: string;
  
    constructor(id: number, nombre: string, correo: string, direccion: string) {
      this.id = id;
      this.nombre = nombre;
      this.correo = correo;
      this.direccion = direccion;
    }
  }
  