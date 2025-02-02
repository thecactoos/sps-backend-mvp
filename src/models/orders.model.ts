// Enum for Order Status
export enum OrderStatus {
    Pending = "pending",
    Shipped = "finished",
    Delivered = "collected",
    Canceled = "canceled",
}


// Interface for Order
export interface Order {
    id: number;
    customer_name: string;
    order_date: Date;
    status: OrderStatus;
    created_by: number;
}
