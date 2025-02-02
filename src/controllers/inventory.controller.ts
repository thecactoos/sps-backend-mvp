import { Request, Response } from "express";
import pool from "../config/database";
import { Inventory } from "../models/inventory.model";

// Utility function to handle errors
const handleError = (error: unknown, res: Response) => {
    if (error instanceof Error) {
        res.status(500).json({ error: error.message });
    } else {
        res.status(500).json({ error: "An unknown error occurred" });
    }
};

// Get all inventory items
export const getInventory = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await pool.query("SELECT * FROM inventory");
        res.json(result.rows);
    } catch (error) {
        handleError(error, res);
    }
};

// Get inventory item by ID
export const getInventoryById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM inventory WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: "Inventory item not found" });
            return;
        }

        res.json(result.rows[0]);
    } catch (error) {
        handleError(error, res);
    }
};

// Create a new inventory item
export const createInventory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { product_id, quantity } = req.body as Inventory;

        const result = await pool.query(
            "INSERT INTO inventory (product_id, quantity, last_updated) VALUES ($1, $2, NOW()) RETURNING *",
            [product_id, quantity]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        handleError(error, res);
    }
};

// Update an inventory item
export const updateInventory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { product_id, quantity } = req.body as Inventory;

        const result = await pool.query(
            "UPDATE inventory SET product_id = $1, quantity = $2, last_updated = NOW() WHERE id = $3 RETURNING *",
            [product_id, quantity, id]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ message: "Inventory item not found" });
            return;
        }

        res.json(result.rows[0]);
    } catch (error) {
        handleError(error, res);
    }
};

// Delete an inventory item
export const deleteInventory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const result = await pool.query("DELETE FROM inventory WHERE id = $1 RETURNING *", [id]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: "Inventory item not found" });
            return;
        }

        res.json({ message: "Inventory item deleted successfully" });
    } catch (error) {
        handleError(error, res);
    }
};
