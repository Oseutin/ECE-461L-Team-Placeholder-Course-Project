import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from '../components/Button'; 

describe('Button Component', () => {
  const handleClick = vi.fn(); // Mock function for click events

  it('renders the button with the correct label', () => {
    render(<Button label="Click Me" onClick={handleClick} />);
    const button = screen.getByRole('button', { name: /Click Me/i });
    expect(button).toBeInTheDocument();
  });

  it('applies the correct variant styles', () => {
    const { rerender } = render(<Button label="Primary" onClick={handleClick} variant="primary" />);
    expect(screen.getByRole('button', { name: /Primary/i })).toHaveClass('bg-blue-600');
    
    rerender(<Button label="Secondary" onClick={handleClick} variant="secondary" />);
    expect(screen.getByRole('button', { name: /Secondary/i })).toHaveClass('bg-gray-200');
    
    rerender(<Button label="Danger" onClick={handleClick} variant="danger" />);
    expect(screen.getByRole('button', { name: /Danger/i })).toHaveClass('bg-red-600');
  });

  it('applies the correct size styles', () => {
    const { rerender } = render(<Button label="Small" onClick={handleClick} size="small" />);
    expect(screen.getByRole('button', { name: /Small/i })).toHaveClass('text-sm');

    rerender(<Button label="Medium" onClick={handleClick} size="medium" />);
    expect(screen.getByRole('button', { name: /Medium/i })).toHaveClass('text-base');

    rerender(<Button label="Large" onClick={handleClick} size="large" />);
    expect(screen.getByRole('button', { name: /Large/i })).toHaveClass('text-lg');
  });

  it('calls the onClick function when clicked', () => {
    render(<Button label="Click Me" onClick={handleClick} />);
    const button = screen.getByRole('button', { name: /Click Me/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders with default props', () => {
    render(<Button label="Default" onClick={handleClick} />);
    const button = screen.getByRole('button', { name: /Default/i });
    expect(button).toHaveClass('bg-blue-600'); 
    expect(button).toHaveClass('text-base'); 
  });
});
