import { Router } from "express";
import {
    getOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
} from "../controllers/orders.controller"; // Import the controller

const router = Router();

// Define routes
router.get("/", getOrders);
router.get("/:id", getOrderById);
router.post("/", createOrder);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

export default router;
