import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Frequencia from '@/pages/professor/frequencia';
import SignIn from '@/pages/login';
import { useUser } from '@/contexts/UserContext';
import api from '@/client/api';

jest.mock('next/router', () => require('next-router-mock'));
jest.mock('@/contexts/UserContext');
jest.mock('@/client/api');

describe('Frequencia Page', () => {
  beforeEach(() => {
    useUser.mockReturnValue({ user: { id_professor: '1' } });
    api.professor.chamadasAbertas.mockResolvedValue({ /* resposta mockada */ });
    api.professor.frequencia.mockResolvedValue({ /* resposta mockada */ });
    api.professor.historicoSemanal.mockResolvedValue({ /* resposta mockada */ });
    api.professor.mediaSemanal.mockResolvedValue({ /* resposta mockada */ });
  });

  it('deve renderizar a página de frequência', async () => {
    render(
        <Frequencia />
    );
    
    await waitFor(() => {
      expect(screen.getByText('Presenças Marcadas')).toBeInTheDocument();
    });
  });

});
