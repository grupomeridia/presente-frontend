import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingBar from '@/components/Loading';

describe('LoadingBar', () => {
  it('renderiza a barra de progresso com a largura correta', () => {
    const progress = 50; // Exemplo de progresso

    render(<LoadingBar progress={progress} />);

    const progressBar = screen.getByTestId('progress-bar'); // Adicione data-testid='progress-bar' à div da barra de progresso
    expect(progressBar).toHaveStyle(`width: ${progress}%`);
  });
});
