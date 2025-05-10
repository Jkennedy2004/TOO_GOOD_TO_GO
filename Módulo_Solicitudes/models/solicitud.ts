export class Solicitud {
  id: number;
  usuarioId: number;
  tipo: string;
  descripcion: string;
  estado: "pendiente" | "aceptada" | "rechazada";
  fechaCreacion: Date;

  constructor(
    id: number,
    usuarioId: number,
    tipo: string,
    descripcion: string,
    estado: "pendiente" | "aceptada" | "rechazada",
    fechaCreacion: Date
  ) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.tipo = tipo;
    this.descripcion = descripcion;
    this.estado = estado;
    this.fechaCreacion = fechaCreacion;
  }
}