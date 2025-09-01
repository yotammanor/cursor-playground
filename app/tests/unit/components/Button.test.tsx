import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Button } from '../../../src/components/ui/button';

describe('Button', () => {
  it('renders correctly', () => {
    const { getByRole } = render(<Button>Click me</Button>);
    expect(getByRole('button')).toBeInTheDocument();
  });

  it('applies variant classes correctly', () => {
    const { getByRole } = render(<Button variant="destructive">Delete</Button>);
    const button = getByRole('button');
    expect(button).toHaveClass('bg-destructive');
  });
});
