export async function updateLoanDueDate(loanId: string, newDate: string) {
  const response = await fetch(`http://localhost:3333/loans/${loanId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dueDate: newDate }) 
  });

  if (!response.ok) throw new Error('Erro ao atualizar no banco');
  return response.json();
}

export async function returnLoanStatus(loanId: string, returnDate: string, justification?: string) {
  const payload: any = { status: 'returned', returnDate };
  if (justification) payload.justification = justification;

  const response = await fetch(`http://localhost:3333/loans/${loanId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) throw new Error('Erro no banco');
  return response.json();
}