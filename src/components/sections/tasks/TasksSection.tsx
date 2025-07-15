import React, { useState, Fragment, useMemo } from 'react';
import { HiFolderAdd, HiCheck, HiSelector } from "react-icons/hi";
import { IoPencil, IoTrash } from "react-icons/io5";
import { CgClose } from "react-icons/cg";
import { Listbox, Transition } from '@headlessui/react';
import { IoChevronBack, IoChevronForward, IoChevronUp, IoChevronDown } from "react-icons/io5";
import DatePicker from 'react-datepicker';
import { Task } from '../../../types/Task';
import { useTaskContext } from './TaskContext';

type SortableKeys = 'title' | 'priority' | 'status' | 'dueDate' | 'createdAt';

const PRIORITIES = ['baixa', 'média', 'alta'];
const STATUS_OPTIONS = ['pendente', 'em_andamento', 'concluída'];

const TasksSection = () => {
  const [isClient, setIsClient] = useState(false);
  const { tasks, setTasks } = useTaskContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState<Omit<Task, 'id' | 'createdAt' | 'completedAt'>>({
    title: '',
    description: '',
    priority: 'média',
    status: 'pendente',
    dueDate: new Date(),
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<{ key: SortableKeys | null; direction: 'ascending' | 'descending' }>({ key: 'createdAt', direction: 'descending' });
  const [errors, setErrors] = useState<{ title?: string; description?: string; dueDate?: string }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 12;
  const [detailModalTask, setDetailModalTask] = useState<Task | null>(null);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = !selectedPriorityFilter || task.priority === selectedPriorityFilter;
    const matchesStatus = !selectedStatusFilter || task.status === selectedStatusFilter;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const requestSort = (key: SortableKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedTasks = useMemo(() => {
    let sortableItems = [...filteredTasks];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key as SortableKeys];
        let bValue = b[sortConfig.key as SortableKeys];
        if (sortConfig.key === 'dueDate' || sortConfig.key === 'createdAt') {
          const aTime = new Date(aValue as Date).getTime();
          const bTime = new Date(bValue as Date).getTime();
          if (aTime < bTime) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (aTime > bTime) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
          return 0;
        }
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredTasks, sortConfig]);

  const totalPages = Math.ceil(sortedTasks.length / tasksPerPage);
  const startIndex = (currentPage - 1) * tasksPerPage;
  const endIndex = startIndex + tasksPerPage;
  const currentTasks = sortedTasks.slice(startIndex, endIndex);

  React.useEffect(() => { setIsClient(true); }, []);
  React.useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedPriorityFilter, selectedStatusFilter]);

  if (!isClient) {
    return <div style={{ minHeight: 300 }} />;
  }

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };
  const goToPreviousPage = () => { goToPage(currentPage - 1); };
  const goToNextPage = () => { goToPage(currentPage + 1); };
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) { pages.push(i); }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      for (let i = startPage; i <= endPage; i++) { pages.push(i); }
    }
    return pages;
  };

  const validateFields = () => {
    const newErrors: { title?: string; description?: string; dueDate?: string } = {};
    if (!newTask.title.trim()) newErrors.title = 'O título é obrigatório';
    if (!newTask.description.trim()) newErrors.description = 'A descrição é obrigatória';
    if (!newTask.dueDate) newErrors.dueDate = 'A data de vencimento é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddTask = () => {
    if (!validateFields()) return;
    const task: Task = { ...newTask, id: Date.now(), createdAt: new Date() };
    setTasks(prev => [...prev, task]);
    setNewTask({ title: '', description: '', priority: 'média', status: 'pendente', dueDate: new Date() });
    setErrors({});
    setIsModalOpen(false);
  };
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setNewTask({ title: task.title, description: task.description, priority: task.priority, status: task.status, dueDate: task.dueDate });
    setIsModalOpen(true);
  };
  const handleUpdateTask = () => {
    if (!validateFields() || !editingTask) return;
    const updatedTask: Task = { ...editingTask, ...newTask, completedAt: newTask.status === 'concluída' ? new Date() : editingTask.completedAt };
    setTasks(prev => prev.map(task => task.id === editingTask.id ? updatedTask : task));
    setEditingTask(null);
    setNewTask({ title: '', description: '', priority: 'média', status: 'pendente', dueDate: new Date() });
    setErrors({});
    setIsModalOpen(false);
  };
  const handleRemoveTask = (taskId: number) => { setTasks(prev => prev.filter(task => task.id !== taskId)); };
  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setNewTask({ title: '', description: '', priority: 'média', status: 'pendente', dueDate: new Date() });
    setErrors({});
  };
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'bg-red-100 text-red-800';
      case 'média': return 'bg-yellow-100 text-yellow-800';
      case 'baixa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluída': return 'bg-green-100 text-green-800';
      case 'em_andamento': return 'bg-blue-100 text-blue-800';
      case 'pendente': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  const formatDate = (date: Date) => { return new Date(date).toLocaleDateString('pt-BR'); };
  const isOverdue = (dueDate: Date) => { return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString(); };

  return (
    <div className="flex flex-col gap-8">
      {/* Botão Adicionar Tarefa, Filtros e Busca */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#fff] shadow text-[#231f20] px-5 py-3 rounded-lg border-none cursor-pointer w-fit flex items-center gap-2 font-medium transition-opacity duration-200 hover:bg-[#ffffff7c]"
        >
          <HiFolderAdd size={26} className="align-middle flex-shrink-0 relative top-[-1px]" />
          Adicionar
        </button>
        {/* Filtro por Prioridade */}
        <div className="relative w-44">
          <Listbox value={selectedPriorityFilter} onChange={setSelectedPriorityFilter}>
            <div className="relative">
              <Listbox.Button className={`bg-[#fff] shadow ${selectedPriorityFilter ? 'text-[#231f20]' : 'text-gray-400'} px-5 py-3 rounded-lg border-none cursor-pointer w-full flex items-center justify-between font-medium transition-opacity duration-200 hover:bg-[#ffffff7c]`}>
                <span className="block truncate">
                  {selectedPriorityFilter || 'Todas as prioridades'}
                </span>
                <HiSelector className="h-5 w-5 text-gray-400 flex-shrink-0" aria-hidden="true" />
              </Listbox.Button>
              <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  <Listbox.Option className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-900'}`} value="">
                    {({ selected }) => (<><span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>Todas as prioridades</span>{selected ? (<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600"><HiCheck className="h-5 w-5" aria-hidden="true" /></span>) : null}</>)}
                  </Listbox.Option>
                  {PRIORITIES.map((priority) => (
                    <Listbox.Option key={priority} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-900'}`} value={priority}>
                      {({ selected }) => (<><span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</span>{selected ? (<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600"><HiCheck className="h-5 w-5" aria-hidden="true" /></span>) : null}</>)}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
        {/* Filtro por Status */}
        <div className="relative w-44">
          <Listbox value={selectedStatusFilter} onChange={setSelectedStatusFilter}>
            <div className="relative">
              <Listbox.Button className={`bg-[#fff] shadow ${selectedStatusFilter ? 'text-[#231f20]' : 'text-gray-400'} px-5 py-3 rounded-lg border-none cursor-pointer w-full flex items-center justify-between font-medium transition-opacity duration-200 hover:bg-[#ffffff7c]`}>
                <span className="block truncate">
                  {selectedStatusFilter || 'Todos os status'}
                </span>
                <HiSelector className="h-5 w-5 text-gray-400 flex-shrink-0" aria-hidden="true" />
              </Listbox.Button>
              <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  <Listbox.Option className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-900'}`} value="">
                    {({ selected }) => (<><span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>Todos os status</span>{selected ? (<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600"><HiCheck className="h-5 w-5" aria-hidden="true" /></span>) : null}</>)}
                  </Listbox.Option>
                  {STATUS_OPTIONS.map((status) => (
                    <Listbox.Option key={status} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-900'}`} value={status}>
                      {({ selected }) => (<><span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}</span>{selected ? (<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600"><HiCheck className="h-5 w-5" aria-hidden="true" /></span>) : null}</>)}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
        {/* Busca */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Buscar por título ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border-none bg-[#fff] text-[#231f20] focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent shadow"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" /></svg>
          </span>
        </div>
      </div>
      {/* Tabela de Tarefas */}
      <div className="bg-[#fff] rounded-2xl px-4 py-6 shadow" style={{ boxShadow: '0 2px 8px #e0e0e0' }}>
        <table className="w-full border-collapse text-[#231f20]">
          <thead>
            <tr>
              <th className="text-left font-medium p-3 border-b border-[#e0e0e0]">
                <button onClick={() => requestSort('title')} className="flex items-center gap-1 font-medium hover:text-gray-500 transition-colors">
                  Título
                  {sortConfig.key === 'title' ? (
                    sortConfig.direction === 'ascending' ? <IoChevronUp /> : <IoChevronDown />
                  ) : <IoChevronDown className="text-gray-300" />}
                </button>
              </th>
              <th className="text-left font-medium p-3 border-b border-[#e0e0e0]">
                <button onClick={() => requestSort('priority')} className="flex items-center gap-1 font-medium hover:text-gray-500 transition-colors">
                  Prioridade
                  {sortConfig.key === 'priority' ? (
                    sortConfig.direction === 'ascending' ? <IoChevronUp /> : <IoChevronDown />
                  ) : <IoChevronDown className="text-gray-300" />}
                </button>
              </th>
              <th className="text-left font-medium p-3 border-b border-[#e0e0e0]">
                <button onClick={() => requestSort('status')} className="flex items-center gap-1 font-medium hover:text-gray-500 transition-colors">
                  Status
                  {sortConfig.key === 'status' ? (
                    sortConfig.direction === 'ascending' ? <IoChevronUp /> : <IoChevronDown />
                  ) : <IoChevronDown className="text-gray-300" />}
                </button>
              </th>
              <th className="text-left font-medium p-3 border-b border-[#e0e0e0]">
                <button onClick={() => requestSort('dueDate')} className="flex items-center gap-1 font-medium hover:text-gray-500 transition-colors">
                  Vencimento
                  {sortConfig.key === 'dueDate' ? (
                    sortConfig.direction === 'ascending' ? <IoChevronUp /> : <IoChevronDown />
                  ) : <IoChevronDown className="text-gray-300" />}
                </button>
              </th>
              <th className="text-left font-medium p-3 border-b border-[#e0e0e0]">
                <button onClick={() => requestSort('createdAt')} className="flex items-center gap-1 font-medium hover:text-gray-500 transition-colors">
                  Criada em
                  {sortConfig.key === 'createdAt' ? (
                    sortConfig.direction === 'ascending' ? <IoChevronUp /> : <IoChevronDown />
                  ) : <IoChevronDown className="text-gray-300" />}
                </button>
              </th>
              <th className="text-left font-medium p-3 border-b border-[#e0e0e0]">Descrição</th>
              <th className="text-left font-medium p-3 border-b border-[#e0e0e0]">Ações</th>
            </tr>
          </thead>
          <tbody>
            {currentTasks.map((task) => (
              <tr key={task.id}>
                <td className="p-3 border-b border-[#e0e0e0]">{task.title}</td>
                <td className="p-3 border-b border-[#e0e0e0]">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium transition-colors duration-200 cursor-default ${getPriorityColor(task.priority)}`}>{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
                </td>
                <td className="p-3 border-b border-[#e0e0e0]">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium transition-colors duration-200 cursor-default ${getStatusColor(task.status)}`}>{task.status.replace('_', ' ').charAt(0).toUpperCase() + task.status.replace('_', ' ').slice(1)}</span>
                </td>
                <td className="p-3 border-b border-[#e0e0e0]">
                  <span>{formatDate(task.dueDate)}</span>
                  {isOverdue(task.dueDate) && (<span className="ml-2 text-xs text-red-600 font-medium">Atrasada</span>)}
                </td>
                <td className="p-3 border-b border-[#e0e0e0]">{formatDate(task.createdAt)}</td>
                <td className="p-3 border-b border-[#e0e0e0] max-w-xs truncate">
                  <button
                    className="w-full text-left truncate hover:underline focus:outline-none"
                    title="Ver detalhes da tarefa"
                    onClick={() => setDetailModalTask(task)}
                  >
                    {task.description}
                  </button>
                </td>
                <td className="p-3 border-b border-[#e0e0e0]">
                  <div className="flex gap-2">
                    <button onClick={() => handleEditTask(task)} className="p-2 rounded-lg bg-gray-400 text-[#fff] cursor-pointer transition-opacity duration-200 hover:bg-gray-500" title="Editar tarefa"><IoPencil size={16} /></button>
                    <button onClick={() => handleRemoveTask(task.id)} className="p-2 rounded-lg opacity-80 bg-[#e61515c5] text-[#fff] cursor-pointer transition-opacity duration-200 hover:opacity-100" title="Remover tarefa"><IoTrash size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Mensagem quando não há tarefas */}
        {sortedTasks.length === 0 && (
          <div className="text-center pt-10 pb-3 text-gray-400">
            {searchTerm || selectedPriorityFilter || selectedStatusFilter
              ? `Nenhuma tarefa encontrada${searchTerm ? ` com o termo "${searchTerm}"` : ''}${selectedPriorityFilter ? ` com prioridade "${selectedPriorityFilter}"` : ''}${selectedStatusFilter ? ` com status "${selectedStatusFilter}"` : ''}.`
              : 'Não há tarefas cadastradas no momento.'}
          </div>
        )}
        {/* Paginação */}
        {sortedTasks.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 px-3">
            <div className="text-sm text-gray-400">
              Mostrando {isClient ? String(startIndex + 1) : ''} - {isClient ? String(Math.min(endIndex, sortedTasks.length)) : ''} de {isClient ? String(sortedTasks.length) : ''} tarefas
            </div>
            <div className="flex items-center gap-2">
              <button onClick={goToPreviousPage} disabled={currentPage === 1} className={`p-2 py-2.5 rounded-lg border transition-all duration-200 ${currentPage === 1 ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border border-gray-300 text-gray-400 hover:bg-gray-100'}`} title="Página anterior"><IoChevronBack size={16} /></button>
              <div className="flex items-center gap-1">
                {getPageNumbers().map((pageNumber) => (
                  <button key={pageNumber} onClick={() => goToPage(pageNumber)} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${pageNumber === currentPage ? 'bg-gray-400 text-white' : 'border border-gray-300 text-gray-500 hover:bg-gray-100'}`}>{isClient ? String(pageNumber) : ''}</button>
                ))}
              </div>
              <button onClick={goToNextPage} disabled={currentPage === totalPages} className={`p-2 py-2.5 rounded-lg border transition-all duration-200 ${currentPage === totalPages ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border border-gray-300 text-gray-400 hover:bg-gray-100'}`} title="Próxima página"><IoChevronForward size={16} /></button>
            </div>
          </div>
        )}
      </div>
      {/* Modal de Adição/Edição de Tarefa */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-[#fff] p-8 py-8 rounded-2xl w-[400px] flex flex-col gap-4 shadow">
            <div className="flex justify-end">
              <button onClick={handleModalClose} className="text-gray-400 text-2xl font-bold cursor-pointer transition-opacity duration-200 hover:opacity-80"><CgClose size={22} style={{ strokeWidth: 1.2 }} /></button>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-gray-600 text-sm font-medium">Título <span className="text-red-500">*</span></label>
              <input type="text" placeholder="Digite o título da tarefa" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1) })} className={`w-full px-3 py-2 rounded-lg border ${errors.title ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent`} />
              {errors.title && (<p className="mt-1 text-sm text-red-600">{errors.title}</p>)}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-gray-600 text-sm font-medium">Descrição <span className="text-red-500">*</span></label>
              <textarea value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1) })} rows={3} className={`w-full px-3 py-2 rounded-lg border ${errors.description ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent`} placeholder="Digite a descrição da tarefa" />
              {errors.description && (<p className="mt-1 text-sm text-red-600">{errors.description}</p>)}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-gray-600 text-sm font-medium">Prioridade</label>
              <Listbox value={newTask.priority} onChange={(priority) => setNewTask({ ...newTask, priority })}>
                <div className="relative">
                  <Listbox.Button className="bg-[#fff] shadow text-[#231f20] px-5 py-3 rounded-lg border-none cursor-pointer w-full flex items-center justify-between font-medium transition-opacity duration-200 hover:bg-[#ffffff7c]">
                    <span className="block truncate">{newTask.priority.charAt(0).toUpperCase() + newTask.priority.slice(1)}</span>
                    <HiSelector className="h-5 w-5 text-gray-400 flex-shrink-0" aria-hidden="true" />
                  </Listbox.Button>
                  <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {PRIORITIES.map((priority) => (
                        <Listbox.Option key={priority} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-900'}`} value={priority}>
                          {({ selected }) => (<><span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</span>{selected ? (<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600"><HiCheck className="h-5 w-5" aria-hidden="true" /></span>) : null}</>)}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-gray-600 text-sm font-medium">Status</label>
              <Listbox value={newTask.status} onChange={(status) => setNewTask({ ...newTask, status })}>
                <div className="relative">
                  <Listbox.Button className="bg-[#fff] shadow text-[#231f20] px-5 py-3 rounded-lg border-none cursor-pointer w-full flex items-center justify-between font-medium transition-opacity duration-200 hover:bg-[#ffffff7c]">
                    <span className="block truncate">{newTask.status.replace('_', ' ').charAt(0).toUpperCase() + newTask.status.replace('_', ' ').slice(1)}</span>
                    <HiSelector className="h-5 w-5 text-gray-400 flex-shrink-0" aria-hidden="true" />
                  </Listbox.Button>
                  <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {STATUS_OPTIONS.map((status) => (
                        <Listbox.Option key={status} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-900'}`} value={status}>
                          {({ selected }) => (<><span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}</span>{selected ? (<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600"><HiCheck className="h-5 w-5" aria-hidden="true" /></span>) : null}</>)}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-gray-600 text-sm font-medium">Data de Vencimento <span className="text-red-500">*</span></label>
              <DatePicker selected={newTask.dueDate} onChange={(date) => setNewTask({ ...newTask, dueDate: date || new Date() })} dateFormat="dd/MM/yyyy" className={`w-full px-3 py-2 rounded-lg border ${errors.dueDate ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent`} placeholderText="Selecione a data de vencimento" />
              {errors.dueDate && (<p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>)}
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button type="button" onClick={handleModalClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">Cancelar</button>
              <button type="button" onClick={editingTask ? handleUpdateTask : handleAddTask} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:opacity-80 transition-colors">{editingTask ? 'Atualizar' : 'Adicionar'}</button>
            </div>
          </div>
        </div>
      )}
      {/* Modal de Detalhes da Tarefa */}
      {detailModalTask && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-0 rounded-2xl w-full max-w-md shadow-2xl relative animate-fadeIn">
            <div className="flex justify-between items-center border-b px-7 py-5 rounded-t-2xl bg-gradient-to-r from-gray-100 to-gray-50">
              <h2 className="text-2xl font-bold text-gray-400 tracking-tight">Detalhes da Tarefa</h2>
              <button
                onClick={() => setDetailModalTask(null)}
                className="text-gray-400 text-2xl font-bold cursor-pointer transition-opacity duration-200 hover:opacity-80"
                title="Fechar"
              >
                <CgClose size={22} style={{ strokeWidth: 1.2 }} />
              </button>
            </div>
            <div className="flex flex-col gap-6 px-7 py-6">
              {/* Grupo: Título e Descrição */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm font-medium">Título</span>
                </div>
                <div className="text-base text-gray-700 bg-gray-50 border border-gray-100 rounded-lg p-3 shadow-inner break-words">
                  {detailModalTask.title}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-gray-500 text-sm font-medium">Descrição</span>
                <div className="text-base text-gray-700 bg-gray-50 border border-gray-100 rounded-lg p-3 whitespace-pre-line break-words max-h-40 overflow-auto shadow-inner">
                  {detailModalTask.description}
                </div>
              </div>
              {/* Grupo: Prioridade e Status */}
              <div className="flex flex-row gap-4 items-center">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm font-medium">Prioridade</span>
                  <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(detailModalTask.priority)}`}>{detailModalTask.priority.charAt(0).toUpperCase() + detailModalTask.priority.slice(1)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm font-medium">Status</span>
                  <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(detailModalTask.status)}`}>{detailModalTask.status.replace('_', ' ').charAt(0).toUpperCase() + detailModalTask.status.replace('_', ' ').slice(1)}</span>
                </div>
              </div>
              {/* Grupo: Datas */}
              <div className="flex flex-col gap-2 bg-gray-50 border border-gray-100 rounded-lg p-3 shadow-inner">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm font-medium">Vencimento</span>
                  <span className="text-[#231f20] font-medium">{formatDate(detailModalTask.dueDate)}</span>
                  {isOverdue(detailModalTask.dueDate) && (<span className="ml-2 text-xs text-red-600 font-medium">Atrasada</span>)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm font-medium">Criada em</span>
                  <span className="text-[#231f20]">{formatDate(detailModalTask.createdAt)}</span>
                </div>
                {detailModalTask.completedAt && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm font-medium">Concluída em</span>
                    <span className="text-[#231f20]">{formatDate(detailModalTask.completedAt)}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end px-7 pb-6">
              <button
                type="button"
                onClick={() => setDetailModalTask(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors font-medium"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksSection; 