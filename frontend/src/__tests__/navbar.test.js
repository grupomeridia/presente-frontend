import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from '@/components/Navbar/navbar';
import { UserContext } from '@/contexts/UserContext'; // Atualize o caminho conforme necessário
import mockRouter from 'next-router-mock';
import { waitFor } from '@testing-library/react';

jest.mock('next/router', () => require('next-router-mock'));

describe('Navbar', () => {
    const mockUser = {
        Cargo: 'Aluno',
        Nome: 'John Doe',
        Curso: 'Engenharia'
    };

    beforeEach(() => {
        mockRouter.setCurrentUrl('/aluno/historico'); 
    });

    it('exibe os itens do menu corretamente para um aluno', () => {
        render(
            <UserContext.Provider value={{ user: mockUser }}>
                <Navbar />
            </UserContext.Provider>
        );

        // Verifique se os itens específicos do aluno estão sendo exibidos
        expect(screen.getByText('Histórico')).toBeInTheDocument();
        expect(screen.getByText('Presença')).toBeInTheDocument();
    });

    it('navega para a página correta quando um item do menu é clicado', async () => {
        render(
            <UserContext.Provider value={{ user: mockUser }}>
                <Navbar />
            </UserContext.Provider>
        );

        // Simule o clique em um item do menu
        userEvent.click(screen.getByText('Histórico'));

        // Aguarde a atualização do estado do roteador
        await waitFor(() => {
            expect(mockRouter.pathname).toBe('/aluno/historico');
        });

        // Adicione mais testes para cobrir outros tipos de usuário (Professor, Secretaria, etc.)
    });
});