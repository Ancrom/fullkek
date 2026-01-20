import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { IUser } from '../../../types/UserType';
import UsersList from './UsersList';

const mockUseQuery = vi.fn();
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual<typeof import('@tanstack/react-query')>(
    '@tanstack/react-query'
  );
  return {
    ...actual,
    useQuery: (...args: unknown[]) => mockUseQuery(...args),
  };
});

vi.mock('../UserCard/UserCard', () => {
  return {
    default: ({ user }: { user: IUser }) => <li data-testid="user-card">{user.username}</li>,
  };
});

describe('UsersList', () => {
  it('renders loading state', () => {
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: true, isError: false });
    const { container } = render(<UsersList />);

    // spinner icon is rendered via <use href="#icon-spinner" />
    expect(container.querySelector('use[href="#icon-spinner"]')).toBeInTheDocument();
  });

  it('renders error state', () => {
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, isError: true });
    render(<UsersList />);

    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('renders empty state', () => {
    mockUseQuery.mockReturnValue({ data: [], isLoading: false, isError: false });
    render(<UsersList />);

    expect(screen.getByText('No users')).toBeInTheDocument();
  });

  it('filters users by input (user action)', async () => {
    const users: IUser[] = [
      {
        id: '1',
        email: 'alpha@domain.com',
        username: 'Alpha',
        emailConfirmed: true,
        role: 'user',
        isActive: true,
        firstName: '',
        lastName: '',
        avatarUrl: '',
        description: '',
        phone: '',
        password: '',
        createdAt: '',
        lastLoginAt: '',
        birthday: '',
      },
      {
        id: '2',
        email: 'beta@domain.com',
        username: 'Beta',
        emailConfirmed: true,
        role: 'user',
        isActive: true,
        firstName: '',
        lastName: '',
        avatarUrl: '',
        description: '',
        phone: '',
        password: '',
        createdAt: '',
        lastLoginAt: '',
        birthday: '',
      },
    ];

    mockUseQuery.mockReturnValue({ data: users, isLoading: false, isError: false });
    render(<UsersList />);

    // initial render contains both cards
    expect(screen.getAllByTestId('user-card')).toHaveLength(2);

    const input = screen.getByPlaceholderText('email or username');
    await userEvent.type(input, 'beta');

    expect(screen.getAllByTestId('user-card')).toHaveLength(1);
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });
});


