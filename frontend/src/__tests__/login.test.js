import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignIn from '@/pages/login';
import { useRouter } from 'next/router';
import { useUser } from '@/contexts/UserContext';
import api from '@/client/api';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/contexts/UserContext', () => ({
  useUser: jest.fn(),
}));

jest.mock('@/client/api');

describe('SignIn Page', () => {
  beforeEach(() => {
    // Configuração dos mocks
    useRouter.mockReturnValue({ push: jest.fn() });
    useUser.mockReturnValue({ user: null, setUser: jest.fn() });
    api.usuario.login.mockResolvedValue({ /* resposta mockada */ });
  });

  it('deve renderizar o formulário de login', () => {
    render(<SignIn />);
    expect(screen.getByPlaceholderText('Login')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument();
    expect(screen.getByText('Acessar')).toBeInTheDocument();
  });

  it('deve permitir a entrada de login e senha', () => {
    render(<SignIn />);
    fireEvent.change(screen.getByPlaceholderText('Login'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: 'password' } });
    expect(screen.getByPlaceholderText('Login')).toHaveValue('test@example.com');
    expect(screen.getByPlaceholderText('Senha')).toHaveValue('password');
  });

  it('deve chamar a API de login ao submeter', async () => {
    render(<SignIn />);
    fireEvent.change(screen.getByPlaceholderText('Login'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: 'password' } });
    fireEvent.click(screen.getByText('Acessar'));

    await waitFor(() => {
      // Verifica se a chamada de API foi feita
      expect(api.usuario.login).toHaveBeenCalledWith({
        login: 'test@example.com',
        senha: 'password',
      });
    });
  });

  // Testes adicionais para verificar a resposta da API e a navegação podem ser adicionados aqui
});
