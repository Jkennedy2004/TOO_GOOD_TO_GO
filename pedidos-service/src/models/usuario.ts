import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from "typeorm";
import { Pedido } from "./pedido";
import { Reserva } from "./reserva";

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id_usuario!: number;

  @Column()
  nombre!: string;

  @Column({ unique: true })
  correo!: string;

  @Column()
  contraseña!: string;

  @Column({ default: "cliente" }) // cliente, restaurante, admin
  tipo_usuario!: string;

  @Column({ nullable: true })
  telefono?: string;

  @Column({ default: true })
  activo!: boolean;

  @CreateDateColumn()
  fecha_registro!: Date;

  @OneToMany(() => Pedido, pedido => pedido.usuario)
  pedidos!: Pedido[];

  @OneToMany(() => Reserva, reserva => reserva.usuario)
  reservas!: Reserva[];
}