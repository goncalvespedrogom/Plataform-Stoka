import React, { createContext, useContext, useState, ReactNode } from 'react';
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
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Implementar sistema de autenticação",
      description: "Criar um sistema completo de login e registro de usuários com validação de dados e tokens JWT.",
      priority: "alta",
      status: "em_andamento",
      dueDate: new Date("2024-02-15"),
      createdAt: new Date("2024-01-20")
    },
    {
      id: 2,
      title: "Criar dashboard de relatórios",
      description: "Desenvolver uma interface para visualização de métricas e relatórios de vendas e estoque.",
      priority: "média",
      status: "pendente",
      dueDate: new Date("2024-02-20"),
      createdAt: new Date("2024-01-25")
    },
    {
      id: 3,
      title: "Testes unitários",
      description: "Implementar testes unitários para todas as funcionalidades principais do sistema.",
      priority: "baixa",
      status: "concluída",
      dueDate: new Date("2024-01-30"),
      createdAt: new Date("2024-01-15"),
      completedAt: new Date("2024-01-28")
    },
    {
      id: 4,
      title: "Otimizar performance",
      description: "Melhorar a performance do sistema através de otimizações de consultas e cache.",
      priority: "alta",
      status: "pendente",
      dueDate: new Date("2024-03-01"),
      createdAt: new Date("2024-01-30")
    },
    {
      id: 5,
      title: "Documentação da API",
      description: "Criar documentação completa da API REST com exemplos de uso e códigos de erro.",
      priority: "média",
      status: "em_andamento",
      dueDate: new Date("2024-02-10"),
      createdAt: new Date("2024-01-22")
    }
  ]);

  return (
    <TaskContext.Provider value={{ tasks, setTasks }}>
      {children}
    </TaskContext.Provider>
  );
}; 