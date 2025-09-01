import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Home from '../../../src/pages/Home';

// Router is mocked in setup.ts so Links render as anchors

describe('Home page', () => {
  it('renders headings and sections', () => {
    const { getByText } = render(<Home />);

    expect(getByText('Task Management App')).toBeInTheDocument();
    expect(getByText('Users')).toBeInTheDocument();
    expect(getByText('Tasks')).toBeInTheDocument();
    expect(getByText('Tech Stack')).toBeInTheDocument();
  });
});
