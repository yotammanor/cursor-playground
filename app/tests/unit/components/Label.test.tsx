import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Label } from '../../../src/components/ui/label';

describe('Label', () => {
  it('renders with text', () => {
    const { getByText } = render(<Label htmlFor="x">Username</Label>);
    expect(getByText('Username')).toBeInTheDocument();
  });

  it('associates with input via htmlFor', () => {
    const { getByText, getByLabelText } = render(
      <div>
        <Label htmlFor="email">Email</Label>
        <input id="email" />
      </div>
    );
    expect(getByText('Email')).toBeInTheDocument();
    expect(getByLabelText('Email')).toBeInTheDocument();
  });
});
