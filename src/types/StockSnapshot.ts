export interface StockSnapshot {
  id: string;
  date: string; // formato ISO, ex: '2024-06-11'
  totalQuantity: number;
  maxQuantity: number; // pico máximo do dia
  userId: string;
} 