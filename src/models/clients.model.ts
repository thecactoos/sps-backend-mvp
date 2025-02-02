// Interface for the Client
export interface Client {
  id?: number;
  name: string;
  email: string;
  phone: string;
  company_name: string;
  address: string;
  created_at: Date;
  updated_at: Date;
}
