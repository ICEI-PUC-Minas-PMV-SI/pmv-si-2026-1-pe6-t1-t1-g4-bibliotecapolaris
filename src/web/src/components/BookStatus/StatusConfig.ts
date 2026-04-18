export type BookStatus = 'to_due' | 'overdue' | 'far_due';

export function getBookStatus(dueDate: Date): BookStatus {
  const today = new Date();

  const diff = dueDate.getTime() - today.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days < 0) return 'overdue';
  if (days <= 2) return 'to_due';
  return 'far_due';
}

function getDeliveryText(dueDate: Date) {
  const today = new Date();

  const diff = dueDate.getTime() - today.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  const formatted = dueDate.toLocaleDateString('pt-BR');

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
    color: '#FFAA00',
    buttonText: 'Alterar Entrega',
  },
  overdue: {
    color: '#E53A41',
    buttonText: 'Justificar Atraso',
  },
  far_due: {
    color: '#00FF2F',
    buttonText: 'Antecipar Entrega',
  },
} as const;

export function resolveBookStatus(dueDate: Date) {
  const type = getBookStatus(dueDate);

  return {
    type,
    config: StatusConfig[type],
    label: getDeliveryText(dueDate),
  };
}
