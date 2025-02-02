import { Router } from "express";
import {
    getInventory,
    getInventoryById,
    createInventory,
    updateInventory,
    deleteInventory
} from "../controllers/inventory.controller"; // Import the controller

const router = Router();

// Define routes
router.get("/", getInventory);
router.get("/:id", getInventoryById);
router.post("/", createInventory);
router.put("/:id", updateInventory);
router.delete("/:id", deleteInventory);

export default router;
