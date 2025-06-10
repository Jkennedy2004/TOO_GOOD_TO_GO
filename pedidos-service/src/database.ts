import "reflect-metadata";
import { DataSource } from "typeorm";
import { Usuario } from "./models/usuario";
import { Restaurante } from "./models/restaurante";
import { Producto } from "./models/producto";
import { Pedido } from "./models/pedido";
import { Reserva } from "./models/reserva";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",         
  password: "1234",      
  database: "too_good_to_go_db",     
  synchronize: true,
  logging: false,
  entities: [Usuario, Restaurante, Producto, Pedido, Reserva],
});