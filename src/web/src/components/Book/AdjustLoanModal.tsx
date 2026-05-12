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

function formatDate(value: string) {
  const numbers = value.replace(/\D/g, '');

  if (numbers.length <= 2) return numbers;

  if (numbers.length <= 4) {
    return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
  }

  return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
}

function brToIso(date: string) {
  if (date.includes('-')) return date;

  const [day, month, year] = date.split('/');

  return `${year}-${month}-${day}`;
}

function isoToBr(date: string | Date) {
  const d =
    date instanceof Date
      ? date
      : (() => {
          const raw = String(date);

          if (raw.includes('/')) {
            const [day, month, year] = raw.split('/').map(Number);
            return new Date(year, month - 1, day);
          }

          if (raw.includes('-')) {
            const [year, month, day] = raw.split('-').map(Number);
            return new Date(year, month - 1, day);
          }

          return new Date(raw);
        })();

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
}

function isValidBR(value: string): boolean {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return false;

  const [day, month, year] = value.split('/').map(Number);

  const date = new Date(year, month - 1, day);

  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

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
      setNewDueDate(isoToBr(loan.dueDate));
      setJustification('');
    }
  }, [loan]);

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
                onChange={(e) => setNewDueDate(formatDate(e.target.value))}
                className="form-input flex-1 text-black p-2 rounded-sm outline-none"
              />

              <ActionButton
                title="Salvar Data"
                onClick={() => isValidBR(newDueDate) && onChangeDueDate(brToIso(newDueDate))}
                disabled={!isValidBR(newDueDate)}
                className={`px-4 rounded-sm ${!isValidBR(newDueDate) ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
            </div>

            {newDueDate && !isValidBR(newDueDate) && (
              <span className="text-red-400 text-sm">Data inválida. Use o formato dd/mm/aaaa.</span>
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
