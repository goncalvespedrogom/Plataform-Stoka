import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../../../types/Product';
import { db } from '../../../firebaseConfig';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../../../hooks/useAuth';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  loading: boolean;
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
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user === undefined) {
      setLoading(true);
      return;
    }
    if (!user) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const q = query(collection(db, 'products'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods: Product[] = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data(),
        date: docSnap.data().date ? docSnap.data().date.toDate ? docSnap.data().date.toDate() : new Date(docSnap.data().date) : undefined,
      }) as Product);
      setProducts(prods);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    if (!user) return;
    await addDoc(collection(db, 'products'), {
      ...product,
      userId: user.uid,
      date: product.date || new Date(),
    });
  };

  const updateProduct = async (id: string, product: Partial<Product>) => {
    if (!user) return;
    await updateDoc(doc(db, 'products', id), {
      ...product,
    });
  };

  const removeProduct = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'products', id));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, removeProduct, loading }}>
      {children}
    </ProductContext.Provider>
  );
}; 