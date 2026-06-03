import { Loan } from '@/types';
import { formatDateBR, getBookStatus } from '@/components/Book/StatusConfig';

export type ModalActionType = 'extend' | 'justify' | 'read_only' | 'admin_manage';

export type ModalConfig = {
  title: string;
  label: string;
  placeholder: string;
  buttonLabel?: string;
  actionType: ModalActionType;
};

export function getModalConfig(
  loan: Loan,
  role: 'student' | 'admin',
  status: ReturnType<typeof getBookStatus>,
): ModalConfig {
  if (role === 'admin') {
    let label = `${loan.book?.name ?? 'selecionado'}`;

    return {
      title: 'Gerenciar Empréstimo',
      label,
      placeholder: `${formatDateBR(loan.dueDate)}`,
      actionType: 'admin_manage',
    };
  }

  switch (status) {
    case 'far_due':
    case 'to_due':
      return {
        title: status === 'far_due' ? 'Antecipar Entrega' : 'Alterar Data de Entrega',
        label: 'Nova Data (DD/MM/AAAA):',
        placeholder: 'Ex: 30/12/2026',
        buttonLabel: 'Renovar Empréstimo',
        actionType: 'extend',
      };

    case 'overdue':
      return loan.justification
        ? {
            title: 'Justificativa Registrada',
            label: 'Sua justificativa foi enviada:',
            placeholder: '',
            actionType: 'read_only',
          }
        : {
            title: 'Justificar Atraso',
            label: 'Motivo do atraso:',
            placeholder: 'Descreva o motivo',
            buttonLabel: 'Enviar Justificativa',
            actionType: 'justify',
          };

    default:
      throw new Error(`Status não suportado: ${status}`);
  }
}
