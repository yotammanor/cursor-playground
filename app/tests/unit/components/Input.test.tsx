import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Input, Textarea } from '../../../src/components/ui/input';

describe('Input', () => {
  it('renders input with placeholder', () => {
    const { getByPlaceholderText } = render(<Input placeholder="Type here" />);
    expect(getByPlaceholderText('Type here')).toBeInTheDocument();
  });

  it('supports type attribute', () => {
    const { getByPlaceholderText } = render(<Input type="password" placeholder="Password" />);
    const el = getByPlaceholderText('Password') as HTMLInputElement;
    expect(el.type).toBe('password');
  });
});

describe('Textarea', () => {
  it('renders textarea with placeholder', () => {
    const { getByPlaceholderText } = render(<Textarea placeholder="Enter text" />);
    expect(getByPlaceholderText('Enter text')).toBeInTheDocument();
  });
});
