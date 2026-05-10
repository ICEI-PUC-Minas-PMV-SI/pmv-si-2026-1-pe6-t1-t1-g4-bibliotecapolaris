export type BookStatus = 'to_due' | 'overdue' | 'far_due' | 'pending';

/**
 * Converte string em `dd/mm/yyyy` (pt-BR) ou `yyyy-mm-dd` (ISO) para Date local.
 * Aceita também Date já parseado.
 */
export function parseDate(input: Date | string): Date {
  if (input instanceof Date) return input;

  if (input.includes('/')) {
    const [d, m, y] = input.split('/').map(Number);
    return new Date(y, m - 1, d);
  }

  if (input.includes('-')) {
    const [y, m, d] = input.split('-').map(Number);
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
    color: 'var(--status-warning)',
    buttonText: 'Alterar Entrega',
  },
  overdue: {
    color: 'var(--status-error)',
    buttonText: 'Justificar Atraso',
  },
  far_due: {
    color: 'var(--status-success)',
    buttonText: 'Antecipar Entrega',
  },
  pending: {
    color: 'var(--status-warning)',
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

  const type = getBookStatus(dueDate);

  return {
    type,
    config: StatusConfig[type],
    label: getDeliveryText(dueDate),
  };
}
