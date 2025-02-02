
// Interface for Product
export interface Product {
    id: number;
    name: string;
    description: string;
    category_id: number;
    brand_id: number;
    unit: string;
    created_at: Date;
    updated_at: Date;
}
