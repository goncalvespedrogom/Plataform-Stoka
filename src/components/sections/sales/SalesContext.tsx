import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Sale } from '../../../types/Sale';
import { db } from '../../../firebaseConfig';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../../../hooks/useAuth';

interface SalesContextType {
  sales: Sale[];
  addSale: (sale: Omit<Sale, 'id'>) => Promise<void>;
  updateSale: (id: string, sale: Partial<Sale>) => Promise<void>;
  removeSale: (id: string) => Promise<void>;
  loading: boolean;
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export const useSalesContext = () => {
  const context = useContext(SalesContext);
  if (!context) {
    throw new Error('useSalesContext deve ser usado dentro de um SalesProvider');
  }
  return context;
};

export const SalesProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user === undefined) {
      setLoading(true);
      return;
    }
    if (!user) {
      setSales([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const q = query(collection(db, 'sales'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sals: Sale[] = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: Number(docSnap.id) || 0,
          productId: typeof data.productId === 'number' ? data.productId : 0,
          productName: data.productName || '',
          quantity: typeof data.quantity === 'number' ? data.quantity : 0,
          salePrice: typeof data.salePrice === 'number' ? data.salePrice : 0,
          saleDate: data.saleDate ? (data.saleDate.toDate ? data.saleDate.toDate() : new Date(data.saleDate)) : new Date(),
          profit: typeof data.profit === 'number' ? data.profit : 0,
          loss: typeof data.loss === 'number' ? data.loss : 0,
        } as Sale;
      });
      setSales(sals);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const addSale = async (sale: Omit<Sale, 'id'>) => {
    if (!user) return;
    await addDoc(collection(db, 'sales'), {
      ...sale,
      userId: user.uid,
      saleDate: sale.saleDate || new Date(),
    });
  };

  const updateSale = async (id: string, sale: Partial<Sale>) => {
    if (!user) return;
    await updateDoc(doc(db, 'sales', id), {
      ...sale,
    });
  };

  const removeSale = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'sales', id));
  };

  return (
    <SalesContext.Provider value={{ sales, addSale, updateSale, removeSale, loading }}>
      {children}
    </SalesContext.Provider>
  );
}; 