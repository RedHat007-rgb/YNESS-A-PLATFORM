import { DataSource } from "typeorm";
import { User } from "../entities/User.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: "postgres://postgres:password@localhost:5432/postgres",
  entities: [User],
  migrations: [__dirname + "./../migrations/*.{ts,js}"],
});
