import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import HistoricoAluno from '@/pages/aluno/historico';
import api from '@/client/api';
import { useUser } from '@/contexts/UserContext';
import mockRouter from 'next-router-mock';

jest.mock('next/router', () => require('next-router-mock'));

jest.mock('@/client/api', () => ({
  aluno: {
    findChamadaByAluno: jest.fn(),
    presencasFaltas: jest.fn(),
  },
}));

jest.mock('@/contexts/UserContext', () => ({
  useUser: jest.fn(),
}));

// Configuração de respostas mockadas
const mockHistoricoData = [
  { id_presenca: 1, nome: "Aluno", status: true, horario: "12/08/2023 19:08:23", tipo_presenca: "Manual" }
];
const mockFaltasPresencasData = {
  data: {
    nome: "Nome do Aluno",
    presencas: 20,
    faltas: 5
  }
};

describe('HistoricoAluno', () => {
  beforeEach(() => {
    useUser.mockReturnValue({ user: { id_aluno: '123' } });
    api.aluno.findChamadaByAluno.mockResolvedValue({ data: mockHistoricoData });
    api.aluno.presencasFaltas.mockResolvedValue({ data: mockFaltasPresencasData });
  });

  it('renderiza e faz chamadas de API corretamente', async () => {
    render(<HistoricoAluno />);

    // Verificar se o estado inicial (Carregando...) é renderizado
    expect(screen.getByText('App Chamada')).toBeInTheDocument();

    // Aguardar a renderização dos dados após a chamada da API
    await waitFor(() => {
      mockHistoricoData.forEach(item => {
        expect(screen.getByText(item.nome)).toBeInTheDocument();
      });
      expect(screen.getByText('Aluno')).toBeInTheDocument();
      expect(screen.getByText('ativo')).toBeInTheDocument();
    });
  });

  // Outros testes (como interações do usuário, etc.) podem ser adicionados aqui
});
