import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LembretesModal from '@/components/lembretesModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Mock para FontAwesomeIcon para evitar problemas de renderização em testes
jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: () => <div data-testid="icon"></div>
}));


describe('LembretesModal', () => {
    const lembretesMock = [
        { id: 1, Titulo: 'Lembrete 1', mensagem: 'Mensagem 1' },
        { id: 2, Titulo: 'Lembrete 2', mensagem: 'Mensagem 2' },
    ];
    const onCloseMock = jest.fn();

    beforeEach(() => {
        render(<LembretesModal lembretes={lembretesMock} onClose={onCloseMock} />);
    });

    it('deve renderizar o primeiro lembrete', () => {
        expect(screen.getByText((content, node) => {
            const hasText = node => node.textContent.includes("Lembrete 1");
            const nodeHasText = hasText(node);
            const childrenDontHaveText = Array.from(node.children).every(child => !hasText(child));

            return nodeHasText && childrenDontHaveText;
        })).toBeInTheDocument();
    });

    it('deve renderizar o segundo lembrete', () => {
        expect(screen.getByText((content, node) => {
            const hasText = node => node.textContent.includes("Lembrete 2");
            const nodeHasText = hasText(node);
            const childrenDontHaveText = Array.from(node.children).every(child => !hasText(child));

            return nodeHasText && childrenDontHaveText;
        })).toBeInTheDocument();
    });

    it('deve chamar onClose quando o botão FECHAR é clicado', () => {
        const lembretesMock = [
          { id: 1, Titulo: 'Lembrete 1', mensagem: 'Mensagem 1' },
          { id: 2, Titulo: 'Lembrete 2', mensagem: 'Mensagem 2' }
        ];
        const onCloseMock = jest.fn();
      
        render(<LembretesModal lembretes={lembretesMock} onClose={onCloseMock} />);
      
        const botoesFechar = screen.getAllByText('FECHAR');
        // Supondo que você queira clicar no botão "FECHAR" do primeiro lembrete
        fireEvent.click(botoesFechar[1]); 
      
        expect(onCloseMock).toHaveBeenCalled();
      });
      
});






