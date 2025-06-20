import React, { useState } from 'react';
import { HiFolderAdd } from "react-icons/hi";
import { IoPencil, IoTrash } from "react-icons/io5";
import { RiCloseCircleFill } from "react-icons/ri";

interface Product {
  id: number;
  name: string;
  quantity: number;
  value: number;
  description?: string;
}

const RegisterSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    quantity: 0,
    value: 0,
    description: ''
  });
  const [formattedValue, setFormattedValue] = useState('');
  // Estados para erros de validação
  const [errors, setErrors] = useState<{ name?: string; quantity?: string; value?: string }>({});

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

  // Função para lidar com mudança no campo de valor
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatToBRL(inputValue);
    setFormattedValue(formatted);
    
    // Atualiza o valor numérico no estado
    const numericValue = extractNumericValue(formatted);
    setNewProduct({ ...newProduct, value: numericValue });
  };

  // Função para validar campos obrigatórios
  const validateFields = () => {
    const newErrors: { name?: string; quantity?: string; value?: string } = {};
    if (!newProduct.name.trim()) {
      newErrors.name = 'Nome do produto é obrigatório.';
    }
    if (!newProduct.quantity || newProduct.quantity <= 0) {
      newErrors.quantity = 'Insira uma quantidade válida.';
    }
    if (!newProduct.value || newProduct.value <= 0) {
      newErrors.value = 'Insira um valor válido.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddProduct = () => {
    if (!validateFields()) return;
    const product: Product = {
      id: products.length + 1,
      ...newProduct
    };
    setProducts([...products, product]);
    setNewProduct({ name: '', quantity: 0, value: 0, description: '' });
    setFormattedValue('');
    setIsModalOpen(false);
    setErrors({});
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      quantity: product.quantity,
      value: product.value,
      description: product.description || ''
    });
    // Formata o valor para exibição no modal
    setFormattedValue(formatToBRL((product.value * 100).toString()));
    setIsModalOpen(true);
  };

  const handleUpdateProduct = () => {
    if (!validateFields()) return;
    if (editingProduct) {
      const updatedProducts = products.map(product => 
        product.id === editingProduct.id 
          ? { ...editingProduct, ...newProduct }
          : product
      );
      setProducts(updatedProducts);
      setEditingProduct(null);
      setNewProduct({ name: '', quantity: 0, value: 0, description: '' });
      setFormattedValue('');
      setIsModalOpen(false);
      setErrors({});
    }
  };

  const handleRemoveProduct = (productId: number) => {
    setProducts(products.filter(product => product.id !== productId));
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setNewProduct({ name: '', quantity: 0, value: 0, description: '' });
    setFormattedValue('');
    setErrors({});
  };

  return (
    <div className="flex flex-col gap-8">
      
      {/* Botão Adicionar Produto */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-[#fff] shadow text-[#231f20] px-5 py-3 rounded-lg border-none cursor-pointer w-fit flex items-center gap-2 font-bold transition-opacity duration-200 hover:bg-[#ffffff7c]"
      >
        <HiFolderAdd size={26} className="align-middle flex-shrink-0 relative top-[-1px]" />
        Adicionar
      </button>

      {/* Tabela de Produtos */}
      <div className="bg-[#fff] rounded-2xl px-4 py-6 shadow" style={{ boxShadow: '0 2px 8px #e0e0e0' }}>
        <table className="w-full border-collapse text-[#231f20]">
          <thead>
            <tr>
              <th className="text-left p-3 border-b border-[#e0e0e0]">Nome</th>
              <th className="text-left p-3 border-b border-[#e0e0e0]">Quantidade</th>
              <th className="text-left p-3 border-b border-[#e0e0e0]">Valor</th>
              <th className="text-left p-3 border-b border-[#e0e0e0]">Descrição</th>
              <th className="text-left p-3 border-b border-[#e0e0e0]">Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="p-3 border-b border-[#e0e0e0]">{product.name}</td>
                <td className="p-3 border-b border-[#e0e0e0]">{product.quantity}</td>
                <td className="p-3 border-b border-[#e0e0e0]">
                  {product.value.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </td>
                <td className="p-3 border-b border-[#e0e0e0]">{product.description}</td>
                <td className="p-3 border-b border-[#e0e0e0]">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="p-2 rounded-lg bg-[#418533d0] text-[#fff] cursor-pointer transition-opacity duration-200 hover:opacity-80"
                      title="Editar produto"
                    >
                      <IoPencil size={16} />
                    </button>
                    <button
                      onClick={() => handleRemoveProduct(product.id)}
                      className="p-2 rounded-lg bg-[#e61515c5] text-[#fff] cursor-pointer transition-opacity duration-200 hover:opacity-80"
                      title="Remover produto"
                    >
                      <IoTrash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Adição/Edição de Produto */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-[#fff] p-8 py-8 rounded-2xl w-[400px] flex flex-col gap-4 shadow">
            {/* Header com X alinhado à direita */}
            <div className="flex justify-end">
              <button
                onClick={handleModalClose}
                className="text-[#222] text-2xl font-bold cursor-pointer transition-opacity duration-200 hover:opacity-80"
              >
                <RiCloseCircleFill size={28} />
              </button>
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-[#222] text-sm font-medium">Nome do Produto <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="Digite o nome do produto"
                value={newProduct.name}
                onChange={(e) => { setNewProduct({ ...newProduct, name: e.target.value }); if (errors.name) setErrors({ ...errors, name: undefined }); }}
                className={`px-3 py-2 rounded-lg border ${errors.name ? 'border-red-500' : 'border-[#e0e0e0]'} bg-[#f5f6fa] text-[#222]`}
              />
              {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name}</span>}
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-[#222] text-sm font-medium">Quantidade <span className="text-red-500">*</span></label>
              <input
                type="number"
                placeholder="Digite a quantidade"
                value={newProduct.quantity}
                onChange={(e) => { setNewProduct({ ...newProduct, quantity: Number(e.target.value) }); if (errors.quantity) setErrors({ ...errors, quantity: undefined }); }}
                className={`px-3 py-2 rounded-lg border ${errors.quantity ? 'border-red-500' : 'border-[#e0e0e0]'} bg-[#f5f6fa] text-[#222]`}
              />
              {errors.quantity && <span className="text-red-500 text-xs mt-1">{errors.quantity}</span>}
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-[#222] text-sm font-medium">Valor (R$) <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="R$ 0,00"
                value={formattedValue}
                onChange={(e) => { handleValueChange(e); if (errors.value) setErrors({ ...errors, value: undefined }); }}
                className={`px-3 py-2 rounded-lg border ${errors.value ? 'border-red-500' : 'border-[#e0e0e0]'} bg-[#f5f6fa] text-[#222]`}
              />
              {errors.value && <span className="text-red-500 text-xs mt-1">{errors.value}</span>}
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-[#222] text-sm font-medium">Descrição (opcional)</label>
              <textarea
                placeholder="Digite uma descrição para o produto"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="px-3 py-2 rounded-lg border border-[#e0e0e0] bg-[#f5f6fa] text-[#222] min-h-[100px]"
              />
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                className="mt-4 px-4 py-2 rounded-lg border-none bg-[#1f1f1f] text-[#fff] cursor-pointer shadow flex items-center gap-2 transition-opacity duration-200 hover:opacity-80 font-bold"
              >
                {editingProduct ? 'Atualizar' : 'Adicionar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterSection; 