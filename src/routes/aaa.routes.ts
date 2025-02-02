import express, { Request, Response } from "express";
import {
  getAllItems,
  getItemById,
  addItem,
  updateItem,
  deleteItem,
} from "../controllers/warehouse.controller";

const router = express.Router();

// Use correct types for route handlers
router.get("/", (req: Request, res: Response) => getAllItems(req, res));
router.get("/:id", (req: Request, res: Response) => getItemById(req, res));
router.post("/", (req: Request, res: Response) => addItem(req, res));
router.put("/:id", (req: Request, res: Response) => updateItem(req, res));
router.delete("/:id", (req: Request, res: Response) => deleteItem(req, res));

export default router;

