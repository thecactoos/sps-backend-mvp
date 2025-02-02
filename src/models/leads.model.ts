
// Interface for Lead
export interface Lead {
    id: number;
    name: string;
    email: string;
    phone: string;
    company_name: string;
    notes: string;
    assigned_to: number;
    created_at: Date;
    updated_at: Date;
}
