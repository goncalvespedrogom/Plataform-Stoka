export interface Product {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalValue: number;
  date: Date;
  description?: string;
} 