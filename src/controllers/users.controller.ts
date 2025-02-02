import { Request, Response } from "express";
import pool from "../config/database";
import { User } from "../models/users.model";

// Utility function to handle errors
const handleError = (error: unknown, res: Response) => {
    if (error instanceof Error) {
        res.status(500).json({ error: error.message });
    } else {
        res.status(500).json({ error: "An unknown error occurred" });
    }
};

// Get all users
export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await pool.query("SELECT id, name, email, role, created_at, updated_at FROM users"); // Exclude password
        res.json(result.rows);
    } catch (error) {
        handleError(error, res);
    }
};

// Get a user by ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.json(result.rows[0]);
    } catch (error) {
        handleError(error, res);
    }
};

// Create a new user (with password hashing)
export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, role } = req.body as User;

        if (!password) {
            res.status(400).json({ error: "Password is required" });
            return;
        }


        const result = await pool.query(
            "INSERT INTO users (name, email, password, role, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING id, name, email, role, created_at, updated_at",
            [name, email, password, role]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        handleError(error, res);
    }
};

// Update a user (password hashing if updated)
export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, email, password, role } = req.body as User;

        let query = "UPDATE users SET name = $1, email = $2, role = $3, updated_at = NOW()";
        let values: (string | number)[] = [name, email, role];


        query += " WHERE id = $" + (values.length + 1) + " RETURNING id, name, email, role, created_at, updated_at";
        values.push(id);

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.json(result.rows[0]);
    } catch (error) {
        handleError(error, res);
    }
};

// Delete a user
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        handleError(error, res);
    }
};

  