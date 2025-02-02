import { Request, Response } from "express";
import pool from "../config/database";
import { WarehouseItem } from "../models/warehouse.model";

interface ApiError {
    error: string;
    details?: string;
  }

// Get all warehouse items
export const getAllItems = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM warehouse_items ORDER BY id ASC');
    res.json(result.rows);
  } catch (ApiError) {
    res.status(500).json(ApiError);
  }
};

// Get single warehouse item
export const getItemById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM warehouse_items WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Item not found" });
    }
    res.json(result.rows[0]);
  } catch (ApiError) {
    res.status(500).json(ApiError);
  }
};

// Add new warehouse item
export const addItem = async (req: Request, res: Response) => {
  const { name, quantity, location }: WarehouseItem = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO warehouse_items (name, quantity, location) VALUES ($1, $2, $3) RETURNING *",
      [name, quantity, location]
    );
    res.status(201).json(result.rows[0]);
  } catch (ApiError) {
    res.status(500).json(ApiError);
  }
};

// Update warehouse item
export const updateItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, quantity, location }: WarehouseItem = req.body;
  try {
    const result = await pool.query(
      "UPDATE warehouse_items SET name = $1, quantity = $2, location = $3 WHERE id = $4 RETURNING *",
      [name, quantity, location, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Item not found" });
    }
    res.json(result.rows[0]);
  } catch (ApiError) {
    res.status(500).json(ApiError);
  }
};

// Delete warehouse item
export const deleteItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM warehouse_items WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Item not found" });
    }
    res.json({ message: "Item deleted successfully" });
  } catch (ApiError) {
    res.status(500).json(ApiError);
  }
};