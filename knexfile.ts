import type { Knex } from "knex";
import { ENVS } from "@/utils";

// Configuração de conexão com o MySQL
const config: { [key: string]: Knex.Config } = {
  production: {
    client: "mysql2",
    connection: {
      host: ENVS.CONFIG.DB.HOST || "main-database.cvc0ua8ketpm.us-east-2.rds.amazonaws.com",
      user: ENVS.CONFIG.DB.USER || "admin",
      port: Number(ENVS.CONFIG.DB.PORT) || 3306,
      password: ENVS.CONFIG.DB.PASSWORD || "D263qkGV2UgRKMX",
      database: ENVS.CONFIG.DB.NAME || "meubolao-database",
    }
  },
};

export default config;