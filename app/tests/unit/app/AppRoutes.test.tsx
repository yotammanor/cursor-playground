import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from '../../../src/App';

// Router primitives are mocked in setup, so we just ensure render doesn't crash

describe('App routes', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeDefined();
  });
});
