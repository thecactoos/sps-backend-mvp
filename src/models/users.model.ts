
// Interface for User
export interface User {
    id: number;
    name: string;
    email: string;
    password?: string; // Optional field
    role: 'admin' | 'warehouse_manager' | 'sales' | 'supplier'; // Enum type
    created_at: Date;
    updated_at: Date;
}
