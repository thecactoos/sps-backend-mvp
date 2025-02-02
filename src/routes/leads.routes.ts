import { Router } from "express";
import {
    getLeads,
    getLeadById,
    createLead,
    updateLead,
    deleteLead
} from "../controllers/leads.controller"; // Import the controller

const router = Router();

// Define routes
router.get("/", getLeads);
router.get("/:id", getLeadById);
router.post("/", createLead);
router.put("/:id", updateLead);
router.delete("/:id", deleteLead);

export default router;