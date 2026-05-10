import '@testing-library/jest-dom';

// Suprime console.error em todos os testes para manter o output limpo.
// Erros legítimos continuam visíveis via falhas de asserção.
jest.spyOn(console, 'error').mockImplementation(() => {});
