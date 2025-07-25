export interface Sale {
  id: string;
  productId: number;
  productName: string;
  quantity: number;
  salePrice: number;
  saleDate: Date;
  profit: number;
  loss: number;
} 