import React, { useState } from 'react';
import { IoAddCircle } from "react-icons/io5";
import { IoPencil, IoTrash } from "react-icons/io5";

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

  const handleAddProduct = () => {
    const product: Product = {
      id: products.length + 1,
      ...newProduct
    };
    setProducts([...products, product]);
    setNewProduct({ name: '', quantity: 0, value: 0, description: '' });
    setFormattedValue('');
    setIsModalOpen(false);
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
  };

  return (
    <div className="flex flex-col gap-8">
      
      {/* Botão Adicionar Produto */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-[#4747475d] text-white px-4 py-2 rounded-lg border-none cursor-pointer w-fit flex items-center gap-2 font-bold transition-opacity duration-200 hover:opacity-80"
      >
        Adicionar um produto
      </button>

      {/* Tabela de Produtos */}
      <div className="bg-[#181818] rounded-2xl p-6">
        <table className="w-full border-collapse text-white">
          <thead>
            <tr>
              <th className="text-left p-3 border-b border-[#333]">Nome</th>
              <th className="text-left p-3 border-b border-[#333]">Quantidade</th>
              <th className="text-left p-3 border-b border-[#333]">Valor</th>
              <th className="text-left p-3 border-b border-[#333]">Descrição</th>
              <th className="text-left p-3 border-b border-[#333]">Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="p-3 border-b border-[#333]">{product.name}</td>
                <td className="p-3 border-b border-[#333]">{product.quantity}</td>
                <td className="p-3 border-b border-[#333]">
                  {product.value.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </td>
                <td className="p-3 border-b border-[#333]">{product.description}</td>
                <td className="p-3 border-b border-[#333]">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="p-2 rounded-lg bg-orange-500 text-white cursor-pointer transition-opacity duration-200 hover:opacity-80"
                      title="Editar produto"
                    >
                      <IoPencil size={16} />
                    </button>
                    <button
                      onClick={() => handleRemoveProduct(product.id)}
                      className="p-2 rounded-lg bg-red-600 text-white cursor-pointer transition-opacity duration-200 hover:opacity-80"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#181818] p-8 py-8 rounded-2xl w-[400px] flex flex-col gap-4">
            {/* Header com X alinhado à direita */}
            <div className="flex justify-end">
              <button
                onClick={handleModalClose}
                className="text-white text-2xl font-bold cursor-pointer transition-opacity duration-200 hover:opacity-80"
              >
                ×
              </button>
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-white text-sm font-bold">Nome do Produto</label>
              <input
                type="text"
                placeholder="Digite o nome do produto"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="px-3 py-2 rounded-lg border border-[#333] bg-[#222] text-white"
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-white text-sm font-bold">Quantidade</label>
              <input
                type="number"
                placeholder="Digite a quantidade"
                value={newProduct.quantity}
                onChange={(e) => setNewProduct({ ...newProduct, quantity: Number(e.target.value) })}
                className="px-3 py-2 rounded-lg border border-[#333] bg-[#222] text-white"
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-white text-sm font-bold">Valor (R$)</label>
              <input
                type="text"
                placeholder="R$ 0,00"
                value={formattedValue}
                onChange={handleValueChange}
                className="px-3 py-2 rounded-lg border border-[#333] bg-[#222] text-white"
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-white text-sm font-bold">Descrição (opcional)</label>
              <textarea
                placeholder="Digite uma descrição para o produto"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="px-3 py-2 rounded-lg border border-[#333] bg-[#222] text-white min-h-[100px]"
              />
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                className="px-4 py-2 rounded-lg border-none bg-[#3b3b3b] text-white cursor-pointer flex items-center gap-2 transition-opacity duration-200 hover:opacity-80 font-bold"
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