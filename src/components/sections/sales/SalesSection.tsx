import React, { useState, useEffect } from 'react';
import { useProductContext } from '../register/ProductContext';
import { SalesProvider, useSalesContext } from './SalesContext';
import { Product } from '../../../types/Product';
import { IoSearch } from "react-icons/io5";
import { IoTrash } from "react-icons/io5";
import { RxUpdate } from "react-icons/rx";
import { Sale } from '../../../types/Sale';

// Função para formatar valor em Real Brasileiro
const formatToBRL = (value: string): string => {
  const numericValue = value.replace(/\D/g, '');
  if (numericValue === '') return '';
  const numberValue = parseFloat(numericValue) / 100;
  return numberValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const extractNumericValue = (formattedValue: string): number => {
  const numericString = formattedValue.replace(/[^\d,]/g, '').replace(',', '.');
  return parseFloat(numericString) || 0;
};

const SalesSectionContent = () => {
  const { products, updateProduct } = useProductContext();
  const { sales, addSale, removeSale } = useSalesContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [salePrice, setSalePrice] = useState('');
  const [saleQuantity, setSaleQuantity] = useState(1);
  const [error, setError] = useState('');
  const [formattedSalePrice, setFormattedSalePrice] = useState('');
  const [hiddenSales, setHiddenSales] = useState<string[]>([]);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetReferenceDate, setResetReferenceDate] = useState<Date | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState<Sale | null>(null);
  // Estado para reset do saldo bruto
  const [resetGrossModalOpen, setResetGrossModalOpen] = useState(false);
  const [resetGrossReferenceDate, setResetGrossReferenceDate] = useState<Date | null>(null);

  // Calcular saldo total (lucro - prejuízo)
  const filteredSales = resetReferenceDate
    ? sales.filter(sale => {
        const saleDate = sale.saleDate instanceof Date ? sale.saleDate : new Date(sale.saleDate);
        return saleDate > resetReferenceDate;
      })
    : sales;
  const totalBalance = filteredSales.reduce((acc, sale) => acc + sale.profit - sale.loss, 0);
  // Calcular Lucro Total (bruto) considerando reset próprio
  const filteredGrossSales = resetGrossReferenceDate
    ? sales.filter(sale => {
        const saleDate = sale.saleDate instanceof Date ? sale.saleDate : new Date(sale.saleDate);
        return saleDate > resetGrossReferenceDate;
      })
    : sales;
  const totalGrossProfit = filteredGrossSales.reduce((acc, sale) => acc + (sale.salePrice * sale.quantity) - sale.loss, 0);

  // Busca produtos pelo nome
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Abrir modal para registrar venda
  const handleRegisterSale = (product: Product) => {
    setSelectedProduct(product);
    setSalePrice('');
    setSaleQuantity(1);
    setError('');
    setIsModalOpen(true);
  };

  // Fechar modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setError('');
  };

  // Atualizar valor formatado ao digitar
  const handleSalePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatToBRL(inputValue);
    setFormattedSalePrice(formatted);
    setSalePrice(formatted);
    if (error) setError('');
  };

  // Registrar venda
  const handleConfirmSale = async () => {
    if (!selectedProduct) return;
    const price = extractNumericValue(formattedSalePrice);
    const quantity = Number(saleQuantity) || 1;
    if (isNaN(price) || price <= 0) {
      setError('Informe um valor de venda válido.');
      return;
    }
    if (quantity <= 0 || quantity > selectedProduct.quantity) {
      setError('Quantidade inválida.');
      return;
    }
    // Calcular lucro/prejuízo
    const unitProfit = price - selectedProduct.unitPrice;
    const totalProfit = unitProfit * quantity;
    // Atualizar estoque do produto
    await updateProduct(selectedProduct.id, {
      quantity: Math.max(0, Number(selectedProduct.quantity) - quantity)
    });
    // Registrar venda
    await addSale({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      quantity: quantity,
      salePrice: price,
      saleDate: new Date(),
      profit: totalProfit > 0 ? totalProfit : 0,
      loss: totalProfit < 0 ? Math.abs(totalProfit) : 0,
    });
    setIsModalOpen(false);
    setSelectedProduct(null);
    setFormattedSalePrice('');
  };

  // Função para ocultar venda visualmente
  const handleHideSale = (saleId: string) => {
    setHiddenSales(prev => [...prev, saleId]);
  };

  // Função para remover venda definitivamente
  const handleRemoveSale = async (saleId: string) => {
    await removeSale(saleId);
  };

  const handleDeleteClick = (sale: Sale) => {
    setSaleToDelete(sale);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (saleToDelete) {
      await handleRemoveSale(saleToDelete.id);
      setShowDeleteModal(false);
      setSaleToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSaleToDelete(null);
  };

  // Persistir referência de reset no localStorage
  useEffect(() => {
    if (resetReferenceDate && typeof window !== 'undefined') {
      localStorage.setItem('salesResetReference', resetReferenceDate.toISOString());
    }
  }, [resetReferenceDate]);
  // Carregar referência de reset ao montar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ref = localStorage.getItem('salesResetReference');
      if (ref) setResetReferenceDate(new Date(ref));
    }
  }, []);
  // Persistir referência de reset bruto no localStorage
  useEffect(() => {
    if (resetGrossReferenceDate && typeof window !== 'undefined') {
      localStorage.setItem('salesGrossResetReference', resetGrossReferenceDate.toISOString());
    }
  }, [resetGrossReferenceDate]);
  // Carregar referência de reset bruto ao montar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ref = localStorage.getItem('salesGrossResetReference');
      if (ref) setResetGrossReferenceDate(new Date(ref));
    }
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white rounded-2xl p-8 shadow flex flex-col" style={{ minHeight: 120 }}>
        <span className="text-gray-400" style={{ fontSize: 14, fontWeight: 500, marginBottom: 18, textAlign: 'left' }}>Registrar Vendas</span>
        <div className="flex flex-col md:flex-row gap-4 items-center relative sales-search-input-wrapper">
          <IoSearch
            style={{
              position: 'absolute',
              left: 12,
              top: 17,
              color: '#9ca3af',
              pointerEvents: 'none'
            }}
            size={20}
          />
          <input
            type="text"
            placeholder="Digite o nome do produto que foi vendido..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              marginTop: 8,
              width: '92%',
              maxWidth: 'none',
              padding: '8px 14px',
              borderRadius: 8,
              border: '1px solid #e0e0e0',
              fontSize: 13,
              outline: 'none',
              boxSizing: 'border-box',
              marginBottom: 12,
              background: '#f3f4f6',
              color: '#333',
              transition: 'box-shadow 0.2s, border 0.2s',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
              paddingLeft: 38 // espaço para o ícone
            }}
          />
        </div>
        {searchTerm && (
          <div className="flex flex-col pt-2 gap-4 mt-4 overflow-y-auto" style={{ maxHeight: 3 * 72 + 16 }}>
            {filteredProducts.length === 0 && (
              <span className="text-gray-400 text-sm ml-0.5">Nenhum produto encontrado.</span>
            )}
            {filteredProducts.slice(0, 3).map(product => (
              <div key={product.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 shadow-sm">
                <div>
                  <div className="font-semibold text-base text-gray-700">{product.name}</div>
                  <div className="text-sm text-gray-500">{product.description || 'Sem descrição.'}</div>
                  <div className="text-xs text-gray-400 mt-2">Estoque: {product.quantity} | Valor unitário: R$ {product.unitPrice.toFixed(2)}</div>
                </div>
                <button
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:opacity-80 transition text-sm"
                  onClick={() => handleRegisterSale(product)}
                  disabled={product.quantity === 0}
                  title={product.quantity === 0 ? 'Sem estoque' : 'Registrar venda'}
                >
                  Registrar venda
                </button>
              </div>
            ))}
          </div>
        )}
        {/* Modal de venda */}
        {isModalOpen && selectedProduct && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-[#fff] p-8 py-8 rounded-2xl w-[400px] flex flex-col gap-4 shadow">
              <div className="flex flex-col gap-1">
                <label className="text-gray-600 text-xs font-medium">Produto</label>
                <div className="w-full text-sm px-3 py-2 rounded-lg border border-[#e0e0e0] bg-[#f5f6fa] text-[#222]">{selectedProduct.name}</div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-gray-600 text-xs font-medium">Valor unitário da venda <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="R$ 0,00"
                  value={formattedSalePrice}
                  onChange={handleSalePriceChange}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-[#e0e0e0] bg-[#f5f6fa] text-[#222] focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-gray-600 text-xs font-medium">Quantidade <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="1"
                    min="1"
                    max={selectedProduct.quantity}
                    value={saleQuantity === 0 ? '' : saleQuantity}
                    onFocus={e => {
                      if (saleQuantity === 0) setSaleQuantity(undefined as any);
                    }}
                    onChange={e => {
                      let value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        setSaleQuantity(value === '' ? 0 : Number(value));
                      }
                      if (error) setError('');
                    }}
                    className={`w-full appearance-none px-3 py-2 rounded-lg border pr-10 text-sm border-[#e0e0e0] bg-[#f5f6fa] ${saleQuantity === 0 ? 'text-gray-400' : 'text-[#222]'} focus:outline-none focus:ring-2 focus:ring-gray-300`}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-[.55rem] pointer-events-none">
                    {/* Espaço reservado para ícone se quiser adicionar */}
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">Quantidade disponível: {selectedProduct.quantity}</div>
              </div>
              {error && <span className="text-red-500 text-[11px] mt-1">{error}</span>}
              <div className="flex gap-3 justify-end pt-4">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmSale}
                  className="px-4 py-2 rounded-lg border-none bg-gray-600 text-white cursor-pointer shadow hover:opacity-80 transition font-medium text-sm"
                >
                  Registrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Listagem de vendas */}
      <div className="bg-white rounded-2xl p-8 shadow flex flex-col">
        <span className="text-gray-400" style={{ fontSize: 14, fontWeight: 500, marginBottom: 18, textAlign: 'left' }}>Histórico de Vendas</span>
        {sales.length === 0 ? (
          <span className="text-gray-400 text-sm">Nenhuma venda registrada ainda.</span>
        ) : (
          <div className="border border-gray-200 rounded-2xl overflow-hidden sales-history-table-wrapper">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f5f6fa]">
                  <th className="py-2 px-3 font-medium text-gray-600 rounded-tl-2xl text-xs">Produto</th>
                  <th className="py-2 px-3 font-medium text-gray-600 text-xs">Data</th>
                  <th className="py-2 px-3 font-medium text-gray-600 text-xs">Quantidade</th>
                  <th className="py-2 px-3 font-medium text-gray-600 text-xs">Valor unitário da venda</th>
                  <th className="py-2 px-3 font-medium text-gray-600 text-xs">Total</th>
                  <th className="py-2 px-3 font-medium text-gray-600 text-xs">Lucro</th>
                  <th className="py-2 px-3 font-medium text-gray-600 text-xs">Prejuízo</th>
                  <th className="py-2 px-3 font-medium text-gray-600 rounded-tr-2xl text-xs">Ações</th>
                </tr>
              </thead>
              <tbody>
                {sales.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center text-gray-400 py-6 text-sm">Nenhuma venda registrada.</td>
                  </tr>
                ) : (
                  sales.map((sale) => (
                    <tr key={sale.id} className="border-t">
                      <td className="py-2 px-3 text-sm">{sale.productName}</td>
                      <td className="py-2 px-3 text-sm">{new Date(sale.saleDate).toLocaleDateString('pt-BR')}</td>
                      <td className="py-2 px-3 text-sm">{sale.quantity}</td>
                      <td className="py-2 px-3 text-sm">{sale.salePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                      <td className="py-2 px-3 text-sm">{(sale.salePrice * sale.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                      <td className="py-2 px-3 text-green-600 text-sm">{sale.profit > 0 ? sale.profit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}</td>
                      <td className="py-2 px-3 text-red-600 text-sm">{sale.loss > 0 ? sale.loss.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}</td>
                      <td className="py-2 px-3 text-sm">
                        <button
                          onClick={() => handleDeleteClick(sale)}
                          className="p-2 rounded bg-gray-100 hover:bg-gray-200 transition text-xs"
                          title="Remover venda"
                        >
                          <IoTrash size={18} className="text-gray-500" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Box de Saldo Total */}
      <div className="flex flex-row gap-4 mt-2 balance-boxes-wrapper">
        <div className="bg-white rounded-2xl p-6 shadow flex flex-col items-start relative flex-1" style={{ maxWidth: 320 }}>
          <div className="flex w-full items-center justify-between mb-2">
            <span className="text-gray-400" style={{ fontSize: 14, fontWeight: 500 }}>Saldo Líquido</span>
            <button
              onClick={() => setResetModalOpen(true)}
              className="p-1 rounded hover:bg-gray-100 transition"
              title="Zerar saldo total"
            >
              <RxUpdate size={20} className="text-gray-400" />
            </button>
          </div>
          <span className={
            totalBalance > 0 ? 'text-green-600 font-bold text-lg' : totalBalance < 0 ? 'text-red-600 font-bold text-lg' : 'text-gray-600 font-bold text-lg'
          }>
            {totalBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </div>
        {/* Box de Lucro Total (Bruto) */}
        <div className="bg-white rounded-2xl p-6 shadow flex flex-col items-start relative flex-1" style={{ maxWidth: 320 }}>
          <div className="flex w-full items-center justify-between mb-2">
            <span className="text-gray-400" style={{ fontSize: 14, fontWeight: 500 }}>Saldo Bruto</span>
            <button
              onClick={() => setResetGrossModalOpen(true)}
              className="p-1 rounded hover:bg-gray-100 transition"
              title="Zerar saldo bruto"
            >
              <RxUpdate size={20} className="text-gray-400" />
            </button>
          </div>
          <span className={
            totalGrossProfit > 0 ? 'text-green-600 font-bold text-lg' : totalGrossProfit < 0 ? 'text-red-600 font-bold text-lg' : 'text-gray-600 font-bold text-lg'
          }>
            {totalGrossProfit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </div>
      </div>
      {/* Modal de confirmação de reset do saldo total */}
      {resetModalOpen && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-[#fff] p-8 py-8 rounded-2xl w-[350px] flex flex-col gap-2 shadow">
            <span className="text-xl font-medium text-gray-700">Deseja realmente zerar o saldo total?</span>
            <span className="text-gray-500 text-sm">O saldo será zerado e passará a contar apenas para as próximas vendas.</span>
            <div className="flex gap-3 justify-end pt-6">
              <button
                onClick={() => setResetModalOpen(false)}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setResetReferenceDate(new Date());
                  setResetModalOpen(false);
                }}
                className="px-4 py-2 text-sm rounded-lg border-none bg-gray-600 text-white font-medium hover:opacity-80 transition"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal de confirmação de reset do saldo bruto */}
      {resetGrossModalOpen && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-[#fff] p-8 py-8 rounded-2xl w-[350px] flex flex-col gap-2 shadow">
            <span className="text-xl font-medium text-gray-700">Deseja realmente zerar o saldo bruto?</span>
            <span className="text-gray-500 text-sm">O saldo bruto será zerado e passará a contar apenas para as próximas vendas.</span>
            <div className="flex gap-3 justify-end pt-6">
              <button
                onClick={() => setResetGrossModalOpen(false)}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setResetGrossReferenceDate(new Date());
                  setResetGrossModalOpen(false);
                }}
                className="px-4 py-2 text-sm rounded-lg border-none bg-gray-600 text-white font-medium hover:opacity-80 transition"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full flex flex-col">
            <h2 className="text-xl font-bold mb-2 text-gray-800">Excluir venda</h2>
            <p className="mb-12 text-gray-600 text-sm">
              Tem certeza que deseja excluir a venda do produto "{saleToDelete?.productName}"?
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
                className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:opacity-80 transition font-medium text-sm"
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

const SalesSection = () => (
  <SalesProvider>
    <SalesSectionContent />
  </SalesProvider>
);

export default SalesSection; 