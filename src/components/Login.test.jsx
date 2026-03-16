// import { useEffect, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from '../states';
import App from '../App';

describe('Login Component', () => {
  it('should handle email and password typing correctly', async () => {
    render(
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>,
    );

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');

    await userEvent.type(emailInput, 'wisnu@test.com');
    await userEvent.type(passwordInput, 'rahasia');

    expect(emailInput).toHaveValue('wisnu@test.com');
    expect(passwordInput).toHaveValue('rahasia');
  });
});
