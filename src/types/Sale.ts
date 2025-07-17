export interface Sale {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  salePrice: number;
  saleDate: Date;
  profit: number;
  loss: number;
} 