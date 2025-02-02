import { Request, Response } from "express";
import { Order, OrderStatus } from "../models/orders.model";
import pool from "../config/database";



// Utility function to handle errors
const handleError = (error: unknown, res: Response) => {
    if (error instanceof Error) {
        res.status(500).json({ error: error.message });
    } else {
        res.status(500).json({ error: "An unknown error occurred" });
    }
};

// Get all orders
export const getOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await pool.query("SELECT * FROM orders");
        res.json(result.rows);
    } catch (error) {
        handleError(error, res);
    }
};

// Get an order by ID
export const getOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM orders WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: "Order not found" });
            return;
        }

        res.json(result.rows[0]);
    } catch (error) {
        handleError(error, res);
    }
};

// Create a new order
export const createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { customer_name, order_date, status, created_by } = req.body as Order;

        // Validate status against the enum
        if (!Object.values(OrderStatus).includes(status)) {
            res.status(400).json({ error: "Invalid order status" });
            return;
        }

        const result = await pool.query(
            "INSERT INTO orders (customer_name, order_date, status, created_by) VALUES ($1, $2, $3, $4) RETURNING *",
            [customer_name, order_date, status, created_by]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        handleError(error, res);
    }
};

// Update an order
export const updateOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { customer_name, order_date, status, created_by } = req.body as Order;

        // Validate status against the enum
        if (!Object.values(OrderStatus).includes(status)) {
            res.status(400).json({ error: "Invalid order status" });
            return;
        }

        const result = await pool.query(
            "UPDATE orders SET customer_name = $1, order_date = $2, status = $3, created_by = $4 WHERE id = $5 RETURNING *",
            [customer_name, order_date, status, created_by, id]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ message: "Order not found" });
            return;
        }

        res.json(result.rows[0]);
    } catch (error) {
        handleError(error, res);
    }
};

// Delete an order
export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const result = await pool.query("DELETE FROM orders WHERE id = $1 RETURNING *", [id]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: "Order not found" });
            return;
        }

        res.json({ message: "Order deleted successfully" });
    } catch (error) {
        handleError(error, res);
    }
};
