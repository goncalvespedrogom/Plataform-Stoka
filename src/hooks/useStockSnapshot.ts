import { useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs, addDoc, Timestamp, orderBy, updateDoc, doc } from 'firebase/firestore';
import { useProductContext, getTotalEstoqueAtual } from '../components/sections/register/ProductContext';
import { useAuth } from './useAuth';
import { StockSnapshot } from '../types/StockSnapshot';

// Salva snapshot diário de estoque se ainda não existir para o dia
export function useStockSnapshotAuto() {
  const { products } = useProductContext();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || products.length === 0) return;
    const todayISO = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
    const saveSnapshot = async () => {
      // Verifica se já existe snapshot para hoje
      const q = query(
        collection(db, 'stockSnapshots'),
        where('userId', '==', user.uid),
        where('date', '==', todayISO)
      );
      const snap = await getDocs(q);
      const totalQuantity = getTotalEstoqueAtual(products);
      if (!snap.empty) {
        // Já existe snapshot para hoje
        const docRef = snap.docs[0].ref;
        const data = snap.docs[0].data();
        // Atualiza o pico máximo se necessário
        if ((data.maxQuantity ?? data.totalQuantity) < totalQuantity) {
          await updateDoc(docRef, {
            maxQuantity: totalQuantity,
            totalQuantity, // opcional: manter totalQuantity atualizado
          });
        }
        return;
      }
      // Salva novo snapshot
      await addDoc(collection(db, 'stockSnapshots'), {
        userId: user.uid,
        date: todayISO,
        totalQuantity,
        maxQuantity: totalQuantity,
        createdAt: Timestamp.now(),
      });
    };
    saveSnapshot();
    // Executa apenas uma vez por dia por usuário
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, products]);
}

// Busca todos os snapshots do usuário, ordenados por data decrescente
export async function getAllSnapshotsByUser(userId: string): Promise<StockSnapshot[]> {
  const q = query(
    collection(db, 'stockSnapshots'),
    where('userId', '==', userId),
    orderBy('date', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as StockSnapshot));
} 