import { Request, Response } from "express";
import pool from "../config/database"; // Import database connection
import { Lead } from "../models/leads.model";

// Utility function to handle errors
const handleError = (error: unknown, res: Response) => {
    if (error instanceof Error) {
        res.status(500).json({ error: error.message });
    } else {
        res.status(500).json({ error: "An unknown error occurred" });
    }
};

// Get all leads
export const getLeads = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await pool.query("SELECT * FROM leads");
        res.json(result.rows);
    } catch (error) {
        handleError(error, res);
    }
};

// Get a lead by ID
export const getLeadById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM leads WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: "Lead not found" });
            return;
        }

        res.json(result.rows[0]);
    } catch (error) {
        handleError(error, res);
    }
};

// Create a new lead
export const createLead = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, phone, company_name, notes, assigned_to } = req.body as Lead;

        const result = await pool.query(
            "INSERT INTO leads (name, email, phone, company_name, notes, assigned_to, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING *",
            [name, email, phone, company_name, notes, assigned_to]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        handleError(error, res);
    }
};

// Update a lead
export const updateLead = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, email, phone, company_name, notes, assigned_to } = req.body as Lead;

        const result = await pool.query(
            "UPDATE leads SET name = $1, email = $2, phone = $3, company_name = $4, notes = $5, assigned_to = $6, updated_at = NOW() WHERE id = $7 RETURNING *",
            [name, email, phone, company_name, notes, assigned_to, id]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ message: "Lead not found" });
            return;
        }

        res.json(result.rows[0]);
    } catch (error) {
        handleError(error, res);
    }
};

// Delete a lead
export const deleteLead = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const result = await pool.query("DELETE FROM leads WHERE id = $1 RETURNING *", [id]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: "Lead not found" });
            return;
        }

        res.json({ message: "Lead deleted successfully" });
    } catch (error) {
        handleError(error, res);
    }
};
