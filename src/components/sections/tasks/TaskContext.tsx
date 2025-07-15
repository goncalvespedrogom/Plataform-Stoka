import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task } from '../../../types/Task';

interface TaskContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  // Função para restaurar datas ao carregar do localStorage
  function parseTasks(raw: any[]): Task[] {
    return raw.map((t) => ({
      ...t,
      dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
      createdAt: t.createdAt ? new Date(t.createdAt) : undefined,
      completedAt: t.completedAt ? new Date(t.completedAt) : undefined,
    }));
  }

  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tasks');
      if (saved) {
        try {
          return parseTasks(JSON.parse(saved));
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  return (
    <TaskContext.Provider value={{ tasks, setTasks }}>
      {children}
    </TaskContext.Provider>
  );
}; 