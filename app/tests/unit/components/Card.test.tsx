import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../src/components/ui/card';

describe('Card', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <Card>
        <CardHeader>
          <CardTitle>Test Title</CardTitle>
        </CardHeader>
        <CardContent>Test content</CardContent>
      </Card>
    );

    expect(getByText('Test Title')).toBeInTheDocument();
    expect(getByText('Test content')).toBeInTheDocument();
  });
});
