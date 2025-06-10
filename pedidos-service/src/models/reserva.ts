import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Producto } from "./producto";
import { Usuario } from "./usuario";

@Entity()
export class Reserva {
  @PrimaryGeneratedColumn()
  id_reserva!: number;

  @CreateDateColumn()
  fecha_reserva!: Date;

  @Column({ type: "timestamp" })
  fecha_recogida!: Date;

  @Column()
  cantidad_reservada!: number;

  @Column({ default: "pendiente" }) // pendiente, confirmada, completada, cancelada
  estado_reserva!: string;

  @Column("decimal", { precision: 10, scale: 2 })
  precio_total!: number;

  @Column({ nullable: true })
  codigo_recogida?: string;

  @ManyToOne(() => Producto, (producto: { reservas: any; }) => producto.reservas)
  producto!: Producto;

  @ManyToOne(() => Usuario, usuario => usuario.reservas)
  usuario!: Usuario;
}