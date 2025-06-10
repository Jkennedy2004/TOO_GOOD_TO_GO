import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from "typeorm";
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

  @Column({ default: "pendiente", length: 20 }) // pendiente, confirmada, completada, cancelada
  estado_reserva!: string;

  @Column("decimal", { precision: 10, scale: 2 })
  precio_total!: number;

  @Column({ nullable: true, length: 10 })
  codigo_recogida?: string;

  @Column("text", { nullable: true })
  notas?: string;

  @UpdateDateColumn()
  fecha_actualizacion!: Date;

  @ManyToOne(() => Producto, producto => producto.reservas, { 
    onDelete: "CASCADE",
    nullable: false 
  })
  @JoinColumn({ name: "id_producto" })
  producto!: Producto;

  @ManyToOne(() => Usuario, usuario => usuario.reservas, { 
    onDelete: "CASCADE",
    nullable: false 
  })
  @JoinColumn({ name: "id_usuario" })
  usuario!: Usuario;
}