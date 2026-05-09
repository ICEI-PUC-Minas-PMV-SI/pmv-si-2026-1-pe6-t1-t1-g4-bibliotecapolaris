'use client';

import { useState, useEffect } from 'react';
import { ActionButton } from '@/components/Global/ActionButton';
import { Loan } from '@/types';

type AdjustLoanModalProps = {
  isOpen: boolean;
  onClose: () => void;
  loan: Loan | null;
  onChangeDueDate: (newDate: string) => void;
  onReturnBook: () => void;
  onJustifyAndReturn: (justification: string) => void;
  isAdmin?: boolean;
};

export function AdjustLoanModal({
  isOpen,
  onClose,
  loan,
  onChangeDueDate,
  onReturnBook,
  onJustifyAndReturn,
  isAdmin = false,
}: AdjustLoanModalProps) {
  const [newDueDate, setNewDueDate] = useState('');
  const [justification, setJustification] = useState('');

  useEffect(() => {
    if (loan) {
      const d =
        loan.dueDate instanceof Date
          ? loan.dueDate
          : (() => {
              const raw = String(loan.dueDate);
              if (raw.includes('/')) {
                const [day, m, y] = raw.split('/').map(Number);
                return new Date(y, m - 1, day);
              }
              if (raw.includes('-')) {
                const [y, m, day] = raw.split('-').map(Number);
                return new Date(y, m - 1, day);
              }
              return new Date(raw);
            })();

      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      setNewDueDate(`${day}/${month}/${year}`);
      setJustification('');
    }
  }, [loan]);

  function isValidBR(value: string): boolean {
    return /^\d{2}\/\d{2}\/\d{4}$/.test(value);
  }

  if (!isOpen || !loan) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50" onClick={onClose}>
      <div
        className="bg-[#1e1e1e] border border-gray-600 p-8 rounded-lg flex flex-col gap-6 w-125 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-gray-700 pb-2">
          <h2 className="text-2xl font-bold text-white">Ajustar: {loan.book?.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl font-bold">
            &times;
          </button>
        </div>

        {loan.status !== 'overdue' && (
          <div className="flex flex-col gap-2">
            <label className="text-white text-lg">Nova data de entrega (dd/mm/aaaa):</label>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                inputMode="numeric"
                placeholder="dd/mm/aaaa"
                maxLength={10}
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="form-input flex-1 text-black p-2 rounded-sm outline-none"
              />
              <ActionButton
                title="Salvar Data"
                onClick={() => isValidBR(newDueDate) && onChangeDueDate(newDueDate)}
                disabled={!isValidBR(newDueDate)}
                className={`px-4 rounded-sm ${!isValidBR(newDueDate) ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
            </div>
            {newDueDate && !isValidBR(newDueDate) && (
              <span className="text-red-400 text-sm">Formato inválido. Use dd/mm/aaaa.</span>
            )}
          </div>
        )}

        {loan.status === 'overdue' ? (
          <div className="flex flex-col gap-3 border-gray-700 pt-4">
            <label className="text-red-400 font-bold text-lg uppercase tracking-wider">Devolução em Atraso</label>
            <p className="text-gray-300 text-sm">
              É obrigatório justificar o motivo do atraso antes de devolver o exemplar:
            </p>

            <textarea
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Descreva o motivo do atraso para evitar multas maiores..."
              className="form-input text-black p-2 rounded-sm resize-none h-24 outline-none"
            />

            <ActionButton
              title="Justificar e Devolver Livro"
              onClick={() => onJustifyAndReturn(justification)}
              disabled={justification.trim() === ''}
              className={`w-full ${justification.trim() === '' ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
          </div>
        ) : (
          isAdmin && (
            <div className="flex flex-col gap-2 border-t border-gray-700 pt-4">
              <label className="text-white text-lg">Já foi entregue?</label>

              <ActionButton title="Entrega concluída" onClick={onReturnBook} className="w-full" />
            </div>
          )
        )}
      </div>
    </div>
  );
}
