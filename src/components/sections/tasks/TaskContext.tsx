import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task } from '../../../types/Task';
import { db } from '../../../firebaseConfig';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../../../hooks/useAuth';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  loading: boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext deve ser usado dentro de um TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user === undefined) {
      setLoading(true);
      return;
    }
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tsks: Task[] = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data(),
        dueDate: docSnap.data().dueDate ? docSnap.data().dueDate.toDate ? docSnap.data().dueDate.toDate() : new Date(docSnap.data().dueDate) : undefined,
        createdAt: docSnap.data().createdAt ? docSnap.data().createdAt.toDate ? docSnap.data().createdAt.toDate() : new Date(docSnap.data().createdAt) : undefined,
      }) as Task);
      setTasks(tsks);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const addTask = async (task: Omit<Task, 'id'>) => {
    if (!user) return;
    await addDoc(collection(db, 'tasks'), {
      ...task,
      userId: user.uid,
      dueDate: task.dueDate || new Date(),
    });
  };

  const updateTask = async (id: string, task: Partial<Task>) => {
    if (!user) return;
    await updateDoc(doc(db, 'tasks', id), {
      ...task,
    });
  };

  const removeTask = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'tasks', id));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, removeTask, loading }}>
      {children}
    </TaskContext.Provider>
  );
}; 