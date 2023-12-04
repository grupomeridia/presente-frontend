import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '@/components/Footer/footer';

describe('Footer', () => {
  it('renderiza o texto de direitos autorais e o logotipo', () => {
    render(<Footer />);

    // Verifica se o texto de direitos autorais está presente
    const copyrightText = screen.getByText(/copyright by/i);
    expect(copyrightText).toBeInTheDocument();

    // Verifica se a imagem do logotipo está presente
    const logoImage = screen.getByAltText('App Logo');
    expect(logoImage).toBeInTheDocument();
  });
});
