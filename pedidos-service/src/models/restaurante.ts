import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Pedido } from "./pedido";
import { Producto } from "./producto";

@Entity()
export class Restaurante {
  @PrimaryGeneratedColumn()
  id_restaurante!: number;

  @Column()
  nombre!: string;

  @Column()
  direccion!: string;

  @Column()
  tipo_cocina!: string;

  @Column()
  horario!: string;

  @Column({ nullable: true })
  telefono?: string;

  @Column({ nullable: true })
  email?: string;

  @Column("decimal", { precision: 10, scale: 8, nullable: true })
  latitud?: number;

  @Column("decimal", { precision: 11, scale: 8, nullable: true })
  longitud?: number;

  @Column({ default: true })
  activo!: boolean;

  @Column({ nullable: true })
  imagen_url?: string;

  @Column("text", { nullable: true })
  descripcion?: string;

  @OneToMany(() => Pedido, pedido => pedido.restaurante)
  pedidos!: Pedido[];

  @OneToMany(() => Producto, (producto: Producto) => producto.restaurante)
  productos!: Producto[];
}