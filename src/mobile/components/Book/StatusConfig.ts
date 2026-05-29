import { Colors } from '@/constants/Theme';

export type BookStatus = 'to_due' | 'overdue' | 'far_due' | 'pending';

export function parseDate(input: Date | string): Date {
  if (input instanceof Date) return input;

  if (input.includes('/')) {
    const [d, m, y] = input.split('/').map(Number);

    return new Date(y, m - 1, d);
  }

  if (input.includes('-')) {
    const parts = input.split('-').map(Number);

    if (parts[0] > 1000) {
      const [y, m, d] = parts;

      return new Date(y, m - 1, d);
    }

    const [d, m, y] = parts;

    return new Date(y, m - 1, d);
  }

  return new Date(input);
}

export function formatDateBR(input: Date | string): string {
  const d = parseDate(input);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function getBookStatus(dueDate: Date | string): BookStatus {
  const due = parseDate(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const diff = due.getTime() - today.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days < 0) return 'overdue';
  if (days <= 2) return 'to_due';
  return 'far_due';
}

function getDeliveryText(dueDate: Date | string) {
  const due = parseDate(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const diff = due.getTime() - today.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  const formatted = formatDateBR(due);

  if (days < 0) {
    return `Atrasado há ${Math.abs(days)} dia(s) - ${formatted}`;
  }

  if (days === 0) {
    return `Entrega hoje - ${formatted}`;
  }

  return `Entrega em ${days} dia(s) - ${formatted}`;
}
export const StatusConfig = {
  to_due: {
    color: Colors.statusWarning,
    buttonText: 'Alterar Entrega',
  },

  overdue: {
    color: Colors.statusError,
    buttonText: 'Justificar Atraso',
  },

  far_due: {
    color: Colors.statusSuccess,
    buttonText: 'Antecipar Entrega',
  },

  pending: {
    color: Colors.statusWarning,
    buttonText: '',
  },

  returned: {
    color: '#6b7280',
    buttonText: '',
  },
} as const;

export function resolveBookStatus(dueDate: Date | string, status?: string) {
  if (status === 'pending') {
    return {
      type: 'pending' as BookStatus,
      config: StatusConfig.pending,
      label: 'Pendente',
    };
  }

  if (status === 'returned') {
    return {
      type: 'returned' as BookStatus,
      config: StatusConfig.returned,
      label: `Devolvido - ${formatDateBR(dueDate)}`,
    };
  }

  const type = getBookStatus(dueDate);

  return {
    type,
    config: StatusConfig[type],
    label: getDeliveryText(dueDate),
  };
}
