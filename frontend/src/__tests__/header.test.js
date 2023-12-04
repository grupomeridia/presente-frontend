import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Cabecalho from '@/components/Cabecalho/cabecalho';
import mockRouter from 'next-router-mock';
import api from '@/client/api';
import { useRouter } from 'next/router';

const useRouterMock = {
  push: jest.fn(),
  // Adicione outras propriedades e métodos conforme necessário
};

jest.mock('next/router', () => ({
  useRouter: () => useRouterMock,
}));


jest.mock('@/contexts/UserContext', () => ({
  useUser: () => ({ user: { Cargo: 'Aluno', id_aluno: 1 } }),
}));

jest.mock('@/client/api');

jest.mock('../components/LembretesModal', () => () => <div>LembretesModal Mock</div>);

describe('Cabecalho', () => {
  beforeEach(() => {
    api.aluno.fetchLembretes.mockResolvedValue({ data: [] });
    mockRouter.setCurrentUrl('/');
  });

  it('deve renderizar o componente Cabecalho', () => {
    render(<Cabecalho />);
    expect(screen.getByText('App Chamada')).toBeInTheDocument();
  });

  it('deve mostrar o botão de logout', () => {
    render(<Cabecalho />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });


  it('deve chamar a função de logout ao clicar no botão', () => {
    render(<Cabecalho />);
    fireEvent.click(screen.getByRole('button'));

    expect(useRouterMock.push).toHaveBeenCalledWith('/login');
  });


});
