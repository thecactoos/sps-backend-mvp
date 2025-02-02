import { Request, Response } from "express";
import pool from "../config/database";
import { Product } from "../models/products.model";

// Utility function to handle errors
const handleError = (error: unknown, res: Response) => {
    if (error instanceof Error) {
        res.status(500).json({ error: error.message });
    } else {
        res.status(500).json({ error: "An unknown error occurred" });
    }
};

// Get all products
export const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await pool.query("SELECT * FROM products");
        res.json(result.rows);
    } catch (error) {
        handleError(error, res);
    }
};

// Get a product by ID
export const getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: "Product not found" });
            return;
        }

        res.json(result.rows[0]);
    } catch (error) {
        handleError(error, res);
    }
};

// Create a new product
export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description, category_id, brand_id, unit } = req.body as Product;

        const result = await pool.query(
            "INSERT INTO products (name, description, category_id, brand_id, unit, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *",
            [name, description, category_id, brand_id, unit]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        handleError(error, res);
    }
};

// Update a product
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, description, category_id, brand_id, unit } = req.body as Product;

        const result = await pool.query(
            "UPDATE products SET name = $1, description = $2, category_id = $3, brand_id = $4, unit = $5, updated_at = NOW() WHERE id = $6 RETURNING *",
            [name, description, category_id, brand_id, unit, id]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ message: "Product not found" });
            return;
        }

        res.json(result.rows[0]);
    } catch (error) {
        handleError(error, res);
    }
};

// Delete a product
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const result = await pool.query("DELETE FROM products WHERE id = $1 RETURNING *", [id]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: "Product not found" });
            return;
        }

        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        handleError(error, res);
    }
};
