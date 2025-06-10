import "reflect-metadata";
import { DataSource } from "typeorm";
import { Usuario } from "./src/models/usuario";
import { Restaurante } from "./src/models/restaurante";
import { Producto } from "./src/models/producto";
import { Pedido } from "./src/models/pedido";
import { HistorialDesperdicio } from "./src/models/historialDesperdicio";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",         
  password: "1234",      
  database: "too_good_to_go_db",     
  synchronize: true,
  logging: false,
  entities: [Usuario, Restaurante, Producto, Pedido, HistorialDesperdicio],
});