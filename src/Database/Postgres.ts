import { Pool } from "pg";

const client = new Pool({
  user: "postgres",
  password: "Alade1&&&",
  host: "localhost",
  port: 5432,
  database: "archnote",
});

export default client;
