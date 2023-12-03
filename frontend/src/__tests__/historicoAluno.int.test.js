import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import HistoricoAluno from '@/pages/aluno/historico';
import { useUser } from '@/contexts/UserContext';
import api from '@/client/api';

jest.mock('next/router', () => require('next-router-mock'));
jest.mock('@/client/api');
jest.mock('@/contexts/UserContext', () => ({
  useUser: jest.fn(),
}));

describe('Página de Histórico do Aluno', () => {
  const userMock = { id_aluno: '1', Cargo: 'Aluno' };
  const presencasMock = [
    { id_presenca: '1', nome: 'Matemática', horario: '08:00', status: true, tipo_presenca: 'Presença' },
    { id_presenca: '2', nome: 'História', horario: '09:00', status: true, tipo_presenca: 'Presença' },
  ];

  beforeEach(() => {
    useUser.mockReturnValue({ user: userMock });
    api.aluno.findChamadaByAluno.mockResolvedValue({ data: presencasMock });
    api.aluno.presencasFaltas.mockResolvedValue({ data: { presencas: 20, faltas: 5, nome: 'Aluno Teste' } });
  });

  
  it('exibe dados do aluno', async () => {
    render(<HistoricoAluno />);
  
    expect(await screen.findByText('Presencas')).toBeInTheDocument();
    expect(await screen.findByText('Faltas')).toBeInTheDocument();
    expect(await screen.findByText('Aluno Teste')).toBeInTheDocument();
  });
  
  

  it('exibe histórico de presenças do aluno', async () => {
    render(<HistoricoAluno />);
  
    expect(await screen.findByText('Matemática')).toBeInTheDocument();
    expect(await screen.findByText('História')).toBeInTheDocument();
  });
  
  

  it('filtra histórico com base na pesquisa', async () => {
    render(<HistoricoAluno />);

    // Simula a ação de digitar no campo de pesquisa
    fireEvent.change(screen.getByPlaceholderText('Pesquisar...'), { target: { value: 'Matemática' } });

    // Espera que apenas os dados filtrados sejam exibidos
    await waitFor(() => {
      expect(screen.getByText('Matemática')).toBeInTheDocument();
      expect(screen.queryByText('História')).not.toBeInTheDocument();
    });
  });

  // Adicione mais testes conforme necessário para verificar outras funcionalidades
});
