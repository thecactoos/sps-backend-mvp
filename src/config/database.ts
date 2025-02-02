import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
  });

pool.on("connect", () => {
    console.log("✅ Connected to PostgreSQL database");
  });
  
// ❌ Log any connection errors
pool.on("error", (err) => {
    console.error("❌ Database connection error:", err);
});

export default pool;

