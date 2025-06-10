import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from "typeorm";
import { Usuario } from "./usuario";
import { Restaurante } from "./restaurante";

@Entity()
export class Pedido {
  @PrimaryGeneratedColumn()
  id_pedido!: number;

  @CreateDateColumn()
  fecha_pedido!: Date;

  @Column({ length: 20, default: "pendiente" }) // pendiente, preparando, listo, entregado, cancelado
  estado!: string;

  @Column("decimal", { precision: 10, scale: 2 })
  total!: number;

  @Column("text", { nullable: true })
  notas?: string;

  @Column({ nullable: true, length: 10 })
  codigo_recogida?: string;

  @UpdateDateColumn()
  fecha_actualizacion!: Date;

  @ManyToOne(() => Usuario, usuario => usuario.pedidos, { 
    onDelete: "CASCADE",
    nullable: false 
  })
  @JoinColumn({ name: "id_usuario" })
  usuario!: Usuario;

  @ManyToOne(() => Restaurante, restaurante => restaurante.pedidos, { 
    onDelete: "CASCADE",
    nullable: false 
  })
  @JoinColumn({ name: "id_restaurante" })
  restaurante!: Restaurante;
}