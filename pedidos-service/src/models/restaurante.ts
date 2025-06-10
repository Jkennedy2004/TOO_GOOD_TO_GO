import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Pedido } from "./pedido";
import { Producto } from "./producto";

@Entity()
export class Restaurante {
  @PrimaryGeneratedColumn()
  id_restaurante!: number;

  @Column({ length: 150 })
  nombre!: string;

  @Column({ type: "text" })
  direccion!: string;

  @Column({ length: 50 })
  tipo_cocina!: string;

  @Column({ length: 100 })
  horario!: string;

  @Column({ nullable: true, length: 15 })
  telefono?: string;

  @Column({ nullable: true, length: 150 })
  email?: string;

  @Column("decimal", { precision: 10, scale: 8, nullable: true })
  latitud?: number;

  @Column("decimal", { precision: 11, scale: 8, nullable: true })
  longitud?: number;

  @Column({ default: true })
  activo!: boolean;

  @Column({ nullable: true, type: "text" })
  imagen_url?: string;

  @Column("text", { nullable: true })
  descripcion?: string;

  @Column("decimal", { precision: 3, scale: 2, default: 0.0 })
  calificacion!: number;

  @CreateDateColumn()
  fecha_registro!: Date;

  @UpdateDateColumn()
  fecha_actualizacion!: Date;

  @OneToMany(() => Pedido, pedido => pedido.restaurante, { cascade: true })
  pedidos!: Pedido[];

  @OneToMany(() => Producto, producto => producto.restaurante, { cascade: true })
  productos!: Producto[];
}