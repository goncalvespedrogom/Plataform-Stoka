export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  salePrice: number;
  saleDate: Date;
  profit: number;
  loss: number;
} 