import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Furusato homepage', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /Raih mimpi kerja/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/Furusato home/i)).toBeInTheDocument();
});
