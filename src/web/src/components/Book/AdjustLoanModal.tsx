'use client';

import { useState, useEffect } from 'react';

type Loan = {
  id: string;
  title: string;
  imageSrc: string;
  dueDate: Date;
  status: string;
};

type AdjustLoanModalProps = {
  isOpen: boolean;
  onClose: () => void;
  loan: Loan | null;
  onAlterarEntrega: (newDate: string) => void;
  onAnteciparEntrega: () => void;
  onJustificarEDevolver: (justification: string) => void;
};

export function AdjustLoanModal({
  isOpen,
  onClose,
  loan,
  onAlterarEntrega,
  onAnteciparEntrega,
  onJustificarEDevolver,
}: AdjustLoanModalProps) {
  
  const [newDueDate, setNewDueDate] = useState('');
  const [justification, setJustification] = useState('');

  useEffect(() => {
    if (loan) {
      setNewDueDate(loan.dueDate.toISOString().split('T')[0]);
      setJustification('');
    }
  }, [loan]);

  if (!isOpen || !loan) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
      <div className="bg-[#1e1e1e] border border-gray-600 p-8 rounded-lg flex flex-col gap-6 w-[500px] shadow-2xl">
        
        <div className="flex justify-between items-center border-b border-gray-700 pb-2">
          <h2 className="text-2xl font-bold text-white">Ajustar: {loan.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl font-bold">&times;</button>
        </div>

        {loan.status !== 'Atrasado' && (
          <div className="flex flex-col gap-2">
            <label className="text-white text-lg">Nova data de entrega (Renovação):</label>
            <div className="flex gap-2">
              <input 
                type="date" 
                value={newDueDate} 
                onChange={(e) => setNewDueDate(e.target.value)} 
                className="form-input flex-1 text-black p-2 rounded-sm outline-none"
              />
              <button 
                onClick={() => onAlterarEntrega(newDueDate)} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-sm font-semibold transition-colors"
              >
                Salvar Data
              </button>
            </div>
          </div>
        )}

        {loan.status === 'Atrasado' ? (
          <div className="flex flex-col gap-3 border-gray-700 pt-4">
            <label className="text-red-400 font-bold text-lg uppercase tracking-wider">Devolução em Atraso</label>
            <p className="text-gray-300 text-sm">É obrigatório justificar o motivo do atraso antes de devolver o exemplar:</p>
            
            <textarea 
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Descreva o motivo do atraso para evitar multas maiores..." 
              className="form-input text-black p-2 rounded-sm resize-none h-24 outline-none"
            />
            
            <button 
              onClick={() => onJustificarEDevolver(justification)} 
              disabled={justification.trim() === ''} 
              className={`p-2 rounded-sm font-semibold w-full transition-colors ${
                justification.trim() === '' ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700 text-white'
              }`}
            >
              Justificar e Devolver Livro
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 border-t border-gray-700 pt-4">
            <label className="text-white text-lg">Terminou a leitura?</label>
            <button 
              onClick={onAnteciparEntrega} 
              className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-sm font-semibold w-full transition-colors"
            >
              Antecipar Entrega (Devolver Hoje)
            </button>
          </div>
        )}

      </div>
    </div>
  );
}