import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from "typeorm";
import { Restaurante } from "./restaurante";
import { Reserva } from "./reserva";

@Entity()
export class Producto {
  @PrimaryGeneratedColumn()
  id_producto!: number;

  @Column()
  nombre!: string;

  @Column("text", { nullable: true })
  descripcion?: string;

  @Column("decimal", { precision: 10, scale: 2 })
  precio_original!: number;

  @Column("decimal", { precision: 10, scale: 2 })
  precio_descuento!: number;

  @Column()
  cantidad_disponible!: number;

  @Column({ type: "timestamp" })
  fecha_caducidad!: Date;

  @Column({ default: true })
  activo!: boolean;

  @Column({ nullable: true })
  imagen_url?: string;

  @CreateDateColumn()
  fecha_creacion!: Date;

  @ManyToOne(() => Restaurante, restaurante => restaurante.productos)
  restaurante!: Restaurante;

  @OneToMany(() => Reserva, reserva => reserva.producto)
  reservas!: Reserva[];
}