import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import warehouseRoutes from "./routes/aaa.routes";
import clientsRoutes from "./routes/clients.routes";
import leadsRoutes from "./routes/leads.routes";
import ordersRoutes from "./routes/orders.routes";
import usersRoutes from "./routes/users.routes";

import pool from "./config/database";


dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

app.use("api/warehouse", warehouseRoutes);
// app.use("api/brands", warehouseRoutes);
// app.use("api/categories", categories);
app.use("api/clients", clientsRoutes);
app.use("api/leads", leadsRoutes);
// app.use("api/names");
app.use("api/orders", ordersRoutes);
app.use("api/users", usersRoutes);



app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
