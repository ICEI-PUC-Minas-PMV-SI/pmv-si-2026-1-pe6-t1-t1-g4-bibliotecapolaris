export function validateRegistration(name: string, email: string, password: string): void {
  if (!name.trim() || !email.trim() || !password.trim()) {
    throw new Error('Preencha todos os campos para se registrar.');
  }

  if (name.trim().length < 3) {
    throw new Error('O nome é obrigatório e deve ter no mínimo 3 caracteres.');
  }

  const emailRegex = /^[a-zA-Z]+\.[a-zA-Z]+@unipolaris\.br$/;
  if (!emailRegex.test(email.trim())) {
    throw new Error('Use o formato nome.sobrenome@unipolaris.br');
  }

  if (password.length < 6) {
    throw new Error('A senha deve ter no mínimo 6 caracteres.');
  }
  if (!/[A-Z]/.test(password)) {
    throw new Error('A senha precisa de pelo menos uma letra maiúscula.');
  }
  if (!/[!@#$%^&*]/.test(password)) {
    throw new Error('A senha precisa de pelo menos um caractere especial (!, @, #, $, etc).');
  }
}