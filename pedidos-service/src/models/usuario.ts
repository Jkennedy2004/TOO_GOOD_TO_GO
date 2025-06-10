import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Pedido } from "./pedido";
import { Reserva } from "./reserva";

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id_usuario!: number;

  @Column({ length: 100 })
  nombre!: string;

  @Column({ unique: true, length: 150 })
  correo!: string;

  @Column({ length: 255 })
  contraseña!: string;

  @Column({ default: "cliente", length: 20 }) // cliente, restaurante, admin
  tipo_usuario!: string;

  @Column({ nullable: true, length: 15 })
  telefono?: string;

  @Column({ nullable: true, type: "text" })
  direccion?: string;

  @Column({ default: true })
  activo!: boolean;

  @CreateDateColumn()
  fecha_registro!: Date;

  @UpdateDateColumn()
  fecha_actualizacion!: Date;

  @OneToMany(() => Pedido, pedido => pedido.usuario, { cascade: true })
  pedidos!: Pedido[];

  @OneToMany(() => Reserva, reserva => reserva.usuario, { cascade: true })
  reservas!: Reserva[];
}