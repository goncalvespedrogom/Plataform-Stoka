import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../../../types/Product';

interface ProductContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext deve ser usado dentro de um ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  // Função para restaurar datas ao carregar do localStorage
  function parseProducts(raw: any[]): Product[] {
    return raw.map((p) => ({
      ...p,
      date: p.date ? new Date(p.date) : undefined,
    }));
  }

  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('products');
      if (saved) {
        try {
          return parseProducts(JSON.parse(saved));
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  return (
    <ProductContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductContext.Provider>
  );
}; 