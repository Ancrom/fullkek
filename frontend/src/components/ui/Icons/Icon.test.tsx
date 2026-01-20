import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Icon from './Icon';

describe('Icon', () => {
  it('renders svg with correct size and href', () => {
    const { container } = render(<Icon name="edit" size={32} />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('height', '32');

    const use = container.querySelector('use');
    expect(use).toBeInTheDocument();
    expect(use).toHaveAttribute('href', '#icon-edit');
  });
});


