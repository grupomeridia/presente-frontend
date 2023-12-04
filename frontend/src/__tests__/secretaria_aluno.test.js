import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Aluno from '@/pages/secretaria/aluno';
import api from '@/client/api';
import '@testing-library/jest-dom';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/client/api');
jest.mock('@/contexts/UserContext');

describe('Aluno', () => {
  beforeEach(() => {
    useUser.mockReturnValue({ user: { id_secretaria: '123' } });
    api.aluno.listAll.mockResolvedValue({
        data: [
          { id: 1, nome: 'Aluno 1', ra: '123456', /* outras propriedades */ },
          { id: 2, nome: 'Aluno 2', ra: '654321', /* outras propriedades */ },
          // Adicione mais alunos mockados conforme necessário
        ],
      });
    api.admin.lembrete.mockResolvedValue({/* resposta mockada */});
    api.aluno.statusAluno.mockResolvedValue({ data: {/* resposta mockada das estatísticas do aluno */} });
    useRouter.mockImplementation(() => ({
        route: '/',
        pathname: '',
        query: '',
        asPath: '',
        // Outras propriedades e métodos conforme necessário
      }));
  });

  it('renderiza corretamente e inicia a busca de alunos', async () => {
    const { getByText, getByPlaceholderText } = render(<Aluno />);
    await waitFor(() => {
      expect(getByText('Nome')).toBeInTheDocument();
      expect(getByPlaceholderText('Pesquisar por nome ou RA...')).toBeInTheDocument();
    });
  });

  // Teste para interações do usuário e chamadas de API subsequentes
});
