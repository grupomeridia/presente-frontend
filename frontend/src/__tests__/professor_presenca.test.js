import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Presenca from '@/pages/secretaria/presenca';
import api from '@/client/api';
import '@testing-library/jest-dom';
import { useRouter } from 'next/router';
import { useUser } from '@/contexts/UserContext';

// Mock do useRouter e da API
jest.mock('next/router', () => require('next-router-mock'));
jest.mock('@/client/api');
jest.mock('@/contexts/UserContext');

describe('Presenca', () => {
  // Mock de resposta da API
  beforeEach(() => {
    useUser.mockReturnValue({ user: { id_aluno: '123' } } );
    api.professor.presenca.mockResolvedValue({ data: { mensagem: 'presenca registrada' } });
  });

  it('renderiza o componente', () => {
    const { getByText } = render(<Presenca />);
    expect(getByText('Realizar Presença')).toBeInTheDocument();
  });

  it('permite a entrada do RA e envia a presença', async () => {
    const { getByPlaceholderText, getByText } = render(<Presenca />);
    fireEvent.change(getByPlaceholderText('Informe o RA'), { target: { value: '123456' } });
    fireEvent.click(getByText('Confirmar Presença'));

    await waitFor(() => {
      expect(api.professor.presenca).toHaveBeenCalledWith({ ra: 123456 });
      expect(getByText('✅ presenca registrada')).toBeInTheDocument();
    });
  });

  // Testes adicionais conforme necessário
});
