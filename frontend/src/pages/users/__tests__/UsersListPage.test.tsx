import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import UsersListPage from '../UsersListPage';

vi.mock('../../../layouts/MainLayout/MainLayout', () => ({
  default: ({ children, type }: { children: React.ReactNode; type?: string }) => (
    <div data-testid="main-layout" data-type={type}>
      {children}
    </div>
  ),
}));

vi.mock('../../../components/users/UsersList/UsersList', () => ({
  default: () => <div data-testid="users-list">Users list</div>,
}));

describe('UsersListPage', () => {
  it('renders main layout and users list', () => {
    render(<UsersListPage />);

    expect(screen.getByTestId('main-layout')).toHaveAttribute('data-type', 'users');
    expect(screen.getByTestId('users-list')).toBeInTheDocument();
  });
});


