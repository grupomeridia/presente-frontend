import React from 'react';
import { render, screen } from '@testing-library/react';
import { Fundo } from '@/components/Fundo/fundo';

describe('Fundo', () => {
  it('renderiza seus filhos corretamente', () => {
    render(
      <Fundo>
        <div>Conteúdo de teste</div>
      </Fundo>
    );

    // Verifica se o conteúdo passado como filho está sendo renderizado
    const childContent = screen.getByText('Conteúdo de teste');
    expect(childContent).toBeInTheDocument();
  });
});
