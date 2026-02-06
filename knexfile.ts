import type { Knex } from "knex";
import 'dotenv/config';

// Configuração de conexão com o MySQL
const config: { [key: string]: Knex.Config } = {
  production: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST || "main-database.cvc0ua8ketpm.us-east-2.rds.amazonaws.com",
      user: process.env.DB_USER || "admin",
      port: Number(process.env.DB_PORT) || 3306,
      password: process.env.DB_PASSWORD || "D263qkGV2UgRKMX",
      database: process.env.DB_NAME || "meubolao-database",
    }
  },
};

export default config;