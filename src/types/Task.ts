export interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'baixa' | 'média' | 'alta';
  status: 'pendente' | 'em_andamento' | 'concluída';
  dueDate: Date;
  createdAt: Date;
  completedAt?: Date;
} 