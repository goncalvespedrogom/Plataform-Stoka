import React, { createContext, useContext, useState, useEffect } from 'react';
import { Sale } from '../../../types/Sale';

interface SalesContextType {
  sales: Sale[];
  setSales: React.Dispatch<React.SetStateAction<Sale[]>>;
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export const useSalesContext = () => {
  const context = useContext(SalesContext);
  if (!context) {
    throw new Error('useSalesContext deve ser usado dentro de um SalesProvider');
  }
  return context;
};

export const SalesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sales, setSales] = useState<Sale[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sales');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed.map((s: any) => ({ ...s, saleDate: new Date(s.saleDate) }));
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('sales', JSON.stringify(sales));
  }, [sales]);

  return (
    <SalesContext.Provider value={{ sales, setSales }}>
      {children}
    </SalesContext.Provider>
  );
}; 