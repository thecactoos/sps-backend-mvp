import { Request, Response } from "express";
import pool from "../config/database";
import { Client } from "../models/clients.model";


// Utility function to handle errors
const handleError = (error: unknown, res: Response) => {
  if (error instanceof Error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(500).json({ error: "An unknown error occurred" });
  }
};

// Get all clients
export const getClients = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query("SELECT * FROM clients");
    res.json(result.rows);
  } catch (error) {
    handleError(error, res);
  }
};

// Get a client by ID
export const getClientById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM clients WHERE id = $1", [id]);
    
    if (result.rows.length === 0) {
      res.status(404).json({ message: "Client not found" });
      return;
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    handleError(error, res);
  }
};

// Create a new client
export const createClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, company_name, address } = req.body as Client;

    const result = await pool.query(
      "INSERT INTO clients (name, email, phone, company_name, address, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *",
      [name, email, phone, company_name, address]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    handleError(error, res);
  }
};

// Update a client
export const updateClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, phone, company_name, address } = req.body as Client;

    const result = await pool.query(
      "UPDATE clients SET name = $1, email = $2, phone = $3, company_name = $4, address = $5, updated_at = NOW() WHERE id = $6 RETURNING *",
      [name, email, phone, company_name, address, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: "Client not found" });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    handleError(error, res);
  }
};

// Delete a client
export const deleteClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM clients WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ message: "Client not found" });
      return;
    }

    res.json({ message: "Client deleted successfully" });
  } catch (error) {
    handleError(error, res);
  }
};
