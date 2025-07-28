import React, { useState, Fragment, useMemo, useEffect } from 'react';
import { HiFolderAdd, HiCheck, HiSelector } from "react-icons/hi";
import { IoPencil, IoTrash } from "react-icons/io5";
import { IoMdAdd, IoMdRemove } from "react-icons/io";
import { RiCloseCircleFill } from "react-icons/ri";
import { IoSearch } from "react-icons/io5";
import { RxUpdate } from "react-icons/rx";
import { CgClose } from "react-icons/cg";
import { Listbox, Transition } from '@headlessui/react';
import { IoChevronBack, IoChevronForward, IoChevronUp, IoChevronDown } from "react-icons/io5";
import DatePicker from 'react-datepicker';
import { Product } from '../../../types/Product';
import { useProductContext } from './ProductContext';

type SortableKeys = 'name' | 'category' | 'quantity' | 'unitPrice' | 'totalValue' | 'date';

// Categorias pré-definidas
const PRODUCT_CATEGORIES = [
  'Eletrônicos',
  'Vestuário',
  'Alimentos',
  'Casa e Jardim',
  'Esportes',
  'Livros',
  'Saúde',
  'Automotivo',
  'Brinquedos',
  'Ferramentas',
  'Papelaria',
  'Pet Shop'
];

// Função utilitária para capitalizar apenas a primeira letra da primeira palavra
function capitalizeFirstWord(name: string) {
  if (!name) return '';
  const [first, ...rest] = name.split(' ');
  return [first.charAt(0).toUpperCase() + first.slice(1), ...rest].join(' ');
}

const RegisterSection = () => {
  const [isClient, setIsClient] = useState(false);
  const { products, addProduct, updateProduct, removeProduct } = useProductContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id' | 'totalValue'>>({
    name: '',
    category: '',
    quantity: 0,
    unitPrice: 0,
    date: new Date(),
    description: ''
  });
  const [formattedUnitPrice, setFormattedUnitPrice] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('');
  // Estado para ordenação
  const [sortConfig, setSortConfig] = useState<{ key: SortableKeys | null; direction: 'ascending' | 'descending' }>({ key: 'name', direction: 'ascending' });
  // Estados para erros de validação
  const [errors, setErrors] = useState<{ name?: string; category?: string; quantity?: string; unitPrice?: string; date?: string }>({});
  
  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Função para filtrar produtos baseado no termo de busca e categoria selecionada
  const filteredProducts = products.filter(product => {
    const name = product.name || '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategoryFilter || product.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const requestSort = (key: SortableKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedProducts = useMemo(() => {
    let sortableItems = [...filteredProducts];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key as SortableKeys];
        let bValue = b[sortConfig.key as SortableKeys];
        if (sortConfig.key === 'date') {
          aValue = new Date(aValue as Date).getTime();
          bValue = new Date(bValue as Date).getTime();
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
  }, [filteredProducts, sortConfig]);

  // Cálculos para paginação
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);

  // Função para navegar para uma página específica
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Função para ir para a página anterior
  const goToPreviousPage = () => {
    goToPage(currentPage - 1);
  };

  // Função para ir para a próxima página
  const goToNextPage = () => {
    goToPage(currentPage + 1);
  };

  // Função para gerar os números das páginas a serem exibidos
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Se temos 5 páginas ou menos, mostra todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Se temos mais de 5 páginas, mostra uma janela deslizante
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      // Ajusta o início se estamos no final
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  // Reset da página atual quando os filtros mudam
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategoryFilter]);

  // Função para formatar valor em Real Brasileiro
  const formatToBRL = (value: string): string => {
    // Remove tudo que não é número
    const numericValue = value.replace(/\D/g, '');
    
    // Se não há valor, retorna vazio
    if (numericValue === '') return '';
    
    // Converte para número e divide por 100 para considerar centavos
    const numberValue = parseFloat(numericValue) / 100;
    
    // Formata para Real Brasileiro
    return numberValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Função para extrair valor numérico do formato BRL
  const extractNumericValue = (formattedValue: string): number => {
    const numericString = formattedValue.replace(/[^\d,]/g, '').replace(',', '.');
    return parseFloat(numericString) || 0;
  };

  // Função para lidar com mudança no campo de preço unitário
  const handleUnitPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatToBRL(inputValue);
    setFormattedUnitPrice(formatted);
    
    // Atualiza o valor numérico no estado
    const numericValue = extractNumericValue(formatted);
    setNewProduct({ ...newProduct, unitPrice: numericValue });
  };

  const handleIncrementQuantity = () => {
    setNewProduct(prev => ({ ...prev, quantity: Number(prev.quantity || 0) + 1 }));
    if (errors.quantity) setErrors({ ...errors, quantity: undefined });
  };

  const handleDecrementQuantity = () => {
    setNewProduct(prev => ({ ...prev, quantity: Math.max(0, Number(prev.quantity || 0) - 1) }));
    if (errors.quantity) setErrors({ ...errors, quantity: undefined });
  };

  // Função para calcular o valor total
  const calculateTotalValue = (quantity: number, unitPrice: number): number => {
    return quantity * unitPrice;
  };

  // Função para validar campos obrigatórios
  const validateFields = () => {
    const newErrors: { name?: string; category?: string; quantity?: string; unitPrice?: string; date?: string } = {};
    if (!newProduct.name.trim()) {
      newErrors.name = 'Nome do produto é obrigatório.';
    }
    if (!newProduct.category) {
      newErrors.category = 'Selecione uma categoria.';
    }
    if (!newProduct.quantity || newProduct.quantity <= 0) {
      newErrors.quantity = 'Insira uma quantidade válida.';
    }
    if (!newProduct.unitPrice || newProduct.unitPrice <= 0) {
      newErrors.unitPrice = 'Insira um preço unitário válido.';
    }
    if (!newProduct.date) {
      newErrors.date = 'Selecione uma data.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [isConfirmMergeModalOpen, setIsConfirmMergeModalOpen] = useState(false);
  const [mergeTargetProduct, setMergeTargetProduct] = useState<Product | null>(null);

  const handleAddProduct = async () => {
    if (!validateFields()) return;
    // Verifica se já existe produto com o mesmo nome (case insensitive)
    const existingProduct = products.find(
      (p) => p.name.trim().toLowerCase() === newProduct.name.trim().toLowerCase()
    );
    if (existingProduct) {
      setMergeTargetProduct(existingProduct);
      setIsConfirmMergeModalOpen(true);
      return;
    }
    const totalValue = calculateTotalValue(newProduct.quantity, newProduct.unitPrice);
    const product: Omit<Product, 'id'> = {
      ...newProduct,
      totalValue,
      date: newProduct.date,
    };
    await addProduct(product);
    setNewProduct({ name: '', category: '', quantity: 0, unitPrice: 0, date: new Date(), description: '' });
    setFormattedUnitPrice('');
    setIsModalOpen(false);
    setErrors({});
  };

  const handleConfirmMerge = () => {
    if (!mergeTargetProduct) return;
    // Mescla os produtos conforme regras
    const oldQuantity = mergeTargetProduct.quantity;
    const newQuantity = oldQuantity + newProduct.quantity;
    const oldUnitPrice = mergeTargetProduct.unitPrice;
    const newUnitPrice = newProduct.unitPrice;
    // Média ponderada
    const mergedUnitPrice = ((oldQuantity * oldUnitPrice) + (newProduct.quantity * newUnitPrice)) / newQuantity;
    const mergedProduct: Product = {
      ...mergeTargetProduct,
      quantity: newQuantity,
      unitPrice: mergedUnitPrice,
      totalValue: newQuantity * mergedUnitPrice,
      // Mantém categoria, data e descrição do produto original
    };
    // setProducts(products.map(p => // This line was removed as per the edit hint
    //   p.id === mergeTargetProduct.id ? mergedProduct : p
    // ));
    setIsConfirmMergeModalOpen(false);
    setIsModalOpen(false);
    setMergeTargetProduct(null);
    setNewProduct({ name: '', category: '', quantity: 0, unitPrice: 0, date: new Date(), description: '' });
    setFormattedUnitPrice('');
    setErrors({});
  };

  const handleCancelMerge = () => {
    setIsConfirmMergeModalOpen(false);
    // Mantém o modal de registro aberto para o usuário editar o nome
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      category: product.category,
      quantity: product.quantity,
      unitPrice: product.unitPrice,
      date: product.date ? new Date(product.date) : new Date(),
      description: product.description || ''
    });
    // Formata o preço unitário para exibição no modal
    setFormattedUnitPrice(formatToBRL((product.unitPrice * 100).toString()));
    setIsModalOpen(true);
  };

  const handleUpdateProduct = async () => {
    if (!validateFields()) return;
    if (editingProduct) {
      const totalValue = calculateTotalValue(newProduct.quantity, newProduct.unitPrice);
      await updateProduct(editingProduct.id, {
        ...newProduct,
        totalValue,
        date: newProduct.date,
      });
      setEditingProduct(null);
      setNewProduct({ name: '', category: '', quantity: 0, unitPrice: 0, date: new Date(), description: '' });
      setFormattedUnitPrice('');
      setIsModalOpen(false);
      setErrors({});
    }
  };

  const handleRemoveProduct = async (productId: string) => {
    await removeProduct(productId);
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      await handleRemoveProduct(productToDelete.id);
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setNewProduct({ name: '', category: '', quantity: 0, unitPrice: 0, date: new Date(), description: '' });
    setFormattedUnitPrice('');
    setErrors({});
  };

  // Função para incrementar a quantidade de um produto na tabela
  const handleIncrementProductQuantity = async (productId: string) => {
    const product = products.find(p => p.id.toString() === productId);
    if (product) {
      const newQuantity = Number(product.quantity) + 1;
      await updateProduct(productId, {
        quantity: newQuantity,
        totalValue: newQuantity * product.unitPrice,
      });
    }
  };

  // Função para decrementar a quantidade de um produto na tabela
  const handleDecrementProductQuantity = async (productId: string) => {
    const product = products.find(p => p.id.toString() === productId);
    if (product) {
      const newQuantity = Math.max(0, Number(product.quantity) - 1);
      await updateProduct(productId, {
        quantity: newQuantity,
        totalValue: newQuantity * product.unitPrice,
      });
    }
  };

  useEffect(() => { setIsClient(true); }, []);
  if (!isClient) {
    return <div style={{ minHeight: 300 }} />;
  }

  return (
    <div className="flex flex-col gap-8">
      
      {/* Botão Adicionar Produto e Input de Busca */}
      <div className="flex items-center gap-4 register-header-actions">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#fff] shadow text-[#231f20] px-5 py-3 rounded-lg border-none cursor-pointer w-fit flex items-center gap-2 font-medium transition-opacity duration-200 hover:bg-[#ffffff7c] text-sm"
        >
          <HiFolderAdd size={24} className="align-middle flex-shrink-0 relative top-[-2px]" />
          Adicionar um produto
        </button>

        {/* Filtro por Categoria */}
        <div className="relative w-56">
          <Listbox
            value={selectedCategoryFilter}
            onChange={setSelectedCategoryFilter}
          >
            <div className="relative">
              <Listbox.Button 
                className={`bg-[#fff] shadow ${selectedCategoryFilter ? 'text-[#231f20]' : 'text-gray-400'} px-5 py-3 rounded-lg border-none cursor-pointer w-full flex items-center justify-between font-medium transition-opacity duration-200 hover:bg-[#ffffff7c] text-sm`}
              >
                <span className="block truncate">
                  {selectedCategoryFilter || "Todas as categorias"}
                </span>
                <HiSelector
                  className="h-5 w-5 text-gray-400 flex-shrink-0"
                  aria-hidden="true"
                />
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  <Listbox.Option
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-900'
                      }`
                    }
                    value=""
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          Todas as categorias
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600">
                            <HiCheck className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                  {PRODUCT_CATEGORIES.map((category) => (
                    <Listbox.Option
                      key={category}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-900'
                        }`
                      }
                      value={category}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? 'font-medium' : 'font-normal'
                            }`}
                          >
                            {category}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600">
                              <HiCheck className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
        
        <div className="relative flex-1 max-w-md">
          <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nome do produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border-none bg-[#fff] text-[#231f20] focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent shadow text-sm"
          />
        </div>
      </div>

      {/* Tabela de Produtos */}
      <div className="bg-[#fff] rounded-2xl pt-0 pb-6 px-0 shadow products-table-wrapper" style={{ boxShadow: '0 2px 8px #e0e0e0' }}>
        <table className="w-full border-collapse text-[#231f20] text-sm">
          <thead>
            <tr className="bg-[#f5f6fa] text-xs">
              <th className="text-left font-medium p-3 border-b border-[#e0e0e0] rounded-tl-2xl text-gray-600">
                <button onClick={() => requestSort('name')} className="flex items-center gap-1 font-medium hover:text-gray-500 transition-colors text-xs">
                  Nome
                  {sortConfig.key === 'name' ? (
                    sortConfig.direction === 'ascending' ? <IoChevronUp /> : <IoChevronDown />
                  ) : <IoChevronDown className="text-gray-300" />}
                </button>
              </th>
              <th className="text-left font-medium p-3 border-b border-[#e0e0e0] text-gray-600 text-xs">
                <button onClick={() => requestSort('category')} className="flex items-center gap-1 font-medium hover:text-gray-500 transition-colors text-xs">
                  Categoria
                  {sortConfig.key === 'category' ? (
                    sortConfig.direction === 'ascending' ? <IoChevronUp /> : <IoChevronDown />
                  ) : <IoChevronDown className="text-gray-300" />}
                </button>
              </th>
              <th className="text-left font-medium p-3 border-b border-[#e0e0e0] text-gray-600 text-xs">
                <button onClick={() => requestSort('quantity')} className="flex items-center gap-1 font-medium hover:text-gray-500 transition-colors text-xs">
                  Quantidade
                  {sortConfig.key === 'quantity' ? (
                    sortConfig.direction === 'ascending' ? <IoChevronUp /> : <IoChevronDown />
                  ) : <IoChevronDown className="text-gray-300" />}
                </button>
              </th>
              <th className="text-left font-medium p-3 border-b border-[#e0e0e0] text-gray-600 text-xs">
                <button onClick={() => requestSort('unitPrice')} className="flex items-center gap-1 font-medium hover:text-gray-500 transition-colors text-xs">
                  Preço Unitário
                  {sortConfig.key === 'unitPrice' ? (
                    sortConfig.direction === 'ascending' ? <IoChevronUp /> : <IoChevronDown />
                  ) : <IoChevronDown className="text-gray-300" />}
                </button>
              </th>
              <th className="text-left font-medium p-3 border-b border-[#e0e0e0] text-gray-600 text-xs">
                <button onClick={() => requestSort('totalValue')} className="flex items-center gap-1 font-medium hover:text-gray-500 transition-colors text-xs">
                  Valor Total
                  {sortConfig.key === 'totalValue' ? (
                    sortConfig.direction === 'ascending' ? <IoChevronUp /> : <IoChevronDown />
                  ) : <IoChevronDown className="text-gray-300" />}
                </button>
              </th>
              <th className="text-left font-medium p-3 border-b border-[#e0e0e0] text-gray-600 text-xs">
                <button onClick={() => requestSort('date')} className="flex items-center gap-1 font-medium hover:text-gray-500 transition-colors text-xs">
                  Data
                  {sortConfig.key === 'date' ? (
                    sortConfig.direction === 'ascending' ? <IoChevronUp /> : <IoChevronDown />
                  ) : <IoChevronDown className="text-gray-300" />}
                </button>
              </th>
              <th className="text-left font-medium p-3 border-b border-[#e0e0e0] text-gray-600 text-xs">Descrição</th>
              <th className="text-left font-medium p-3 border-b border-[#e0e0e0] rounded-tr-2xl text-gray-600 text-xs">Ações</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product) => (
              <tr key={product.id}>
                <td className="p-3 border-b border-[#e0e0e0] text-sm">{product.name}</td>
                <td className="p-3 border-b border-[#e0e0e0]">
                  <span 
                    className="px-2 py-1 bg-[#f0f0f0] rounded-full text-xs font-medium transition-colors duration-200 cursor-default"
                    style={{ backgroundColor: '#f0f0f0' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                  >
                    {product.category}
                  </span>
                </td>
                <td className="p-3 border-b border-[#e0e0e0] text-sm">{product.quantity}</td>
                <td className="p-3 border-b border-[#e0e0e0] text-sm">
                  {product.unitPrice.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </td>
                <td className="p-3 border-b border-[#e0e0e0] text-sm">
                  {product.totalValue.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </td>
                <td className="p-3 border-b border-[#e0e0e0] text-sm">
                  {product.date ? new Date(product.date).toLocaleDateString('pt-BR') : ''}
                </td>
                <td className="p-3 border-b border-[#e0e0e0] text-sm">{product.description}</td>
                <td className="p-3 border-b border-[#e0e0e0] text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="p-2 rounded bg-gray-100 hover:bg-gray-200 transition"
                      title="Editar produto"
                    >
                      <IoPencil size={18} className="text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(product)}
                      className="p-2 rounded bg-gray-100 hover:bg-gray-200 transition"
                      title="Remover produto"
                    >
                      <IoTrash size={18} className="text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleIncrementProductQuantity(product.id.toString())}
                      className="p-2 rounded bg-gray-100 hover:bg-gray-200 transition"
                      title="Adicionar quantidade"
                    >
                      <IoMdAdd size={18} className="text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleDecrementProductQuantity(product.id.toString())}
                      className="p-2 rounded bg-gray-100 hover:bg-gray-200 transition"
                      title="Diminuir quantidade"
                    >
                      <IoMdRemove size={18} className="text-gray-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Mensagem quando não há produtos ou quando a busca não retorna resultados */}
        {sortedProducts.length === 0 && (
          <div className="text-center pt-10 pb-3 text-gray-400 text-sm">
            {searchTerm || selectedCategoryFilter 
              ? `Nenhum produto encontrado${searchTerm ? ` com o nome "${searchTerm}"` : ''}${selectedCategoryFilter ? ` na categoria "${selectedCategoryFilter}"` : ''}.` 
              : 'Não há produtos registrados no momento.'}
          </div>
        )}

        {/* Controles de Paginação */}
        {sortedProducts.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 px-3">
            {/* Informações da página atual */}
            <div className="text-sm text-gray-400">
              Mostrando {isClient ? startIndex + 1 : ''} - {isClient ? Math.min(endIndex, sortedProducts.length) : ''} de {isClient ? sortedProducts.length : ''} produtos
            </div>
            {/* Controles de navegação */}
            <div className="flex items-center gap-2">
              {/* Botão Anterior */}
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`p-2 py-2.5 rounded-lg border transition-all duration-200 ${currentPage === 1 ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border border-gray-300 text-gray-400 hover:bg-gray-100'}`}
                title="Página anterior"
              >
                <IoChevronBack size={16} />
              </button>
              {/* Números das páginas */}
              <div className="flex items-center gap-1">
                {getPageNumbers().map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => goToPage(Number(pageNumber))}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${pageNumber === currentPage ? 'bg-gray-400 text-white' : 'border border-gray-300 text-gray-500 hover:bg-gray-100'}`}
                  >
                    {isClient ? pageNumber : ''}
                  </button>
                ))}
              </div>
              {/* Botão Próximo */}
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`p-2 py-2.5 rounded-lg border transition-all duration-200 ${currentPage === totalPages ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border border-gray-300 text-gray-400 hover:bg-gray-100'}`}
                title="Próxima página"
              >
                <IoChevronForward size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Adição/Edição de Produto */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-[#fff] p-8 py-8 rounded-2xl w-[400px] max-w-[90vw] sm:w-[400px] flex flex-col gap-4 shadow text-sm">
            {/* Header com X alinhado à direita */}
            <div className="flex justify-end">
              <button
                onClick={handleModalClose}
                className="text-gray-400 text-2xl font-bold cursor-pointer transition-opacity duration-200 hover:opacity-80"
              >
                <CgClose size={22} style={{ strokeWidth: 1.2 }} />
              </button>
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-gray-600 text-xs font-medium">Nome do Produto <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="Digite o nome do produto"
                value={newProduct.name}
                onChange={(e) => {
                  const value = e.target.value;
                  const formatted = value.charAt(0).toUpperCase() + value.slice(1);
                  setNewProduct({ ...newProduct, name: formatted });
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                className={`w-full sm:text-sm px-3 py-2 rounded-lg border ${errors.name ? 'border-red-500' : 'border-[#e0e0e0]'} bg-[#f5f6fa] text-[#222] focus:outline-none focus:ring-2 focus:ring-gray-300`}
              />
              {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-gray-600 text-xs font-medium">Categoria <span className="text-red-500">*</span></label>
              <Listbox
                value={newProduct.category}
                onChange={(value) => {
                  setNewProduct({ ...newProduct, category: value });
                  if (errors.category) setErrors({ ...errors, category: undefined });
                }}
              >
                <div className="relative">
                  <Listbox.Button 
                    className={`relative w-full cursor-default rounded-lg border bg-[#f5f6fa] ${newProduct.category ? 'text-[#222]' : 'text-gray-400'} px-3 py-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-gray-300 focus-visible:ring-offset-2 sm:text-sm ${errors.category ? 'border-red-500' : 'border-[#e0e0e0]'}`}
                  >
                    <span className="block truncate">{newProduct.category || "Selecione uma categoria"}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <HiSelector
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {PRODUCT_CATEGORIES.map((category) => (
                        <Listbox.Option
                          key={category}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-900'
                            }`
                          }
                          value={category}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? 'font-medium' : 'font-normal'
                                }`}
                              >
                                {category}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600">
                                  <HiCheck className="h-5 w-5" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
              {errors.category && <span className="text-red-500 text-xs mt-1">{errors.category}</span>}
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-gray-600 text-xs font-medium">Quantidade <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="0"
                  value={newProduct.quantity === 0 ? '' : newProduct.quantity}
                  onFocus={() => {
                    if (newProduct.quantity === 0) {
                      setNewProduct({ ...newProduct, quantity: undefined as any });
                    }
                  }}
                  onChange={(e) => {
                    let value = e.target.value;
                    // Garante que só números positivos sejam aceitos
                    if (/^\d*$/.test(value)) {
                      setNewProduct({ ...newProduct, quantity: value === '' ? 0 : Number(value) });
                    }
                    if (errors.quantity) setErrors({ ...errors, quantity: undefined });
                  }}
                  className={`w-full appearance-none px-3 py-2 rounded-lg border pr-10 sm:text-sm ${errors.quantity ? 'border-red-500' : 'border-[#e0e0e0]'} bg-[#f5f6fa] ${newProduct.quantity === 0 ? 'text-gray-400' : 'text-[#222]'} focus:outline-none focus:ring-2 focus:ring-gray-300`}
                />
                
                {/* Visual Icon (non-interactive) */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-[.55rem] pointer-events-none">
                  <HiSelector className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                
                {/* Invisible buttons for functionality */}
                <div className="absolute inset-y-0 right-0 flex flex-col w-10">
                  <button
                    type="button"
                    className="flex-1 cursor-pointer rounded-tr-lg"
                    onClick={handleIncrementQuantity}
                    aria-label="Aumentar quantidade"
                  />
                  <button
                    type="button"
                    className="flex-1 cursor-pointer rounded-br-lg"
                    onClick={handleDecrementQuantity}
                    aria-label="Diminuir quantidade"
                  />
                </div>
              </div>
              {errors.quantity && <span className="text-red-500 text-xs mt-1">{errors.quantity}</span>}
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-gray-600 text-xs font-medium">Preço Unitário <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="R$ 0,00"
                value={formattedUnitPrice}
                onChange={(e) => { handleUnitPriceChange(e); if (errors.unitPrice) setErrors({ ...errors, unitPrice: undefined }); }}
                className={`w-full sm:text-sm px-3 py-2 rounded-lg border ${errors.unitPrice ? 'border-red-500' : 'border-[#e0e0e0]'} bg-[#f5f6fa] text-[#222] focus:outline-none focus:ring-2 focus:ring-gray-300`}
              />
              {errors.unitPrice && <span className="text-red-500 text-xs mt-1">{errors.unitPrice}</span>}
            </div>

            {/* Exibição do valor total calculado */}
            {newProduct.quantity > 0 && newProduct.unitPrice > 0 && (
              <div className="flex flex-col gap-1">
                <label className="text-gray-600 text-xs font-medium">Valor Total</label>
                <div className="px-3 py-2 rounded-lg border border-[#e0e0e0] bg-[#f8f9fa] text-[#222] text-sm">
                  {calculateTotalValue(newProduct.quantity, newProduct.unitPrice).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </div>
              </div>
            )}
            
            <div className="flex flex-col gap-1">
              <label className="text-gray-600 text-xs font-medium">Data <span className="text-red-500">*</span></label>
              <DatePicker
                selected={newProduct.date}
                onChange={(date: Date | null) => { setNewProduct({ ...newProduct, date: date || new Date() }); if (errors.date) setErrors({ ...errors, date: undefined }); }}
                dateFormat="dd/MM/yyyy"
                className={`w-full sm:text-sm px-3 py-2 rounded-lg border ${errors.date ? 'border-red-500' : 'border-[#e0e0e0]'} bg-[#f5f6fa] text-[#222] focus:outline-none focus:ring-2 focus:ring-gray-300`}
                placeholderText="Selecione a data"
                locale="pt-BR"
              />
              {errors.date && <span className="text-red-500 text-xs mt-1">{errors.date}</span>}
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-gray-600 text-xs font-medium">Descrição <span className="text-gray-400 font-normal">(opcional)</span></label>
              <textarea
                placeholder="Digite uma descrição para o produto"
                value={newProduct.description}
                onChange={(e) => {
                  const value = e.target.value;
                  const formatted = value.charAt(0).toUpperCase() + value.slice(1);
                  setNewProduct({ ...newProduct, description: formatted });
                }}
                className="w-full text-sm px-3 py-2 rounded-lg border border-[#e0e0e0] bg-[#f5f6fa] text-[#222] min-h-[100px] focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                className="mt-4 px-4 py-2 rounded-lg border-none bg-gray-600 text-[#fff] cursor-pointer shadow flex items-center gap-2 transition-opacity duration-200 hover:opacity-80 font-medium text-sm"
              >
                {editingProduct ? (
                  <>
                    <RxUpdate size={20} />
                    Atualizar
                  </>
                ) : (
                  <>
                    <HiFolderAdd size={20} className="text-white" />
                    Adicionar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal de Confirmação de Mesclagem */}
      {isConfirmMergeModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl w-[400px] max-w-[90vw] sm:w-[400px] flex flex-col gap-4 shadow-lg text-sm">
            <div className="text-lg font-semibold text-gray-600">Produto já registrado</div>
            <div className="text-gray-500 text-sm">Este produto já está registrado na lista, portanto ele será recalculado e adicionado ao produto já existente.</div>
            <div className="flex gap-3 justify-end pt-8">
              <button
                onClick={handleCancelMerge}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmMerge}
                className="px-4 py-2 rounded-lg border-none bg-gray-600 text-white cursor-pointer shadow hover:opacity-80 transition font-medium"
              >
                Prosseguir
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-[90vw] w-full sm:max-w-sm flex flex-col text-sm">
            <h2 className="text-xl font-bold mb-2 text-gray-800">Excluir produto</h2>
            <p className="mb-12 text-gray-600 text-sm">
              Tem certeza que deseja excluir o produto "{productToDelete?.name}"?
            </p>
            <div className="flex gap-4 w-full justify-center">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:opacity-80 transition font-medium"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterSection; 