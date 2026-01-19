import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import UserCard from './UserCard';
import type { IUser } from '../../../types/UserType';

const USER: IUser = {
  id: '1',
  email: 'email@domain.com',
  username: 'username',
  emailConfirmed: true,
  role: 'user',
  isActive: true,
  firstName: 'firstName',
  lastName: 'lastName',
  avatarUrl: 'avatarUrl',
  description: 'description',
  phone: 'phone',
  password: 'password',
  createdAt: '2022-01-01',
  lastLoginAt: '2022-01-02',
  birthday: '2022-01-03',
};

describe('UserCard', () => {
  it('renders user fields and edit link', () => {
    render(
      <MemoryRouter>
        <ul>
          <UserCard user={USER} />
        </ul>
      </MemoryRouter>
    );

    expect(screen.getByText('Created at: 2022-01-01')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: USER.username })).toBeInTheDocument();
    expect(screen.getByText(USER.email)).toBeInTheDocument();
    expect(screen.getByText(USER.role)).toBeInTheDocument();
    expect(screen.getByText('active')).toBeInTheDocument();
    expect(screen.getByText('Last login at:')).toBeInTheDocument();
    expect(screen.getByText(USER.lastLoginAt)).toBeInTheDocument();
    expect(screen.getByText('Phone number:')).toBeInTheDocument();
    expect(screen.getByText(USER.phone)).toBeInTheDocument();

    const editLink = screen.getByRole('link');
    expect(editLink).toHaveAttribute('href', `/users/edit/${USER.id}`);
  });

  it('renders inactive state and "never" when lastLoginAt missing', () => {
    const user: IUser = { ...USER, isActive: false, lastLoginAt: '' };
    render(
      <MemoryRouter>
        <ul>
          <UserCard user={user} />
        </ul>
      </MemoryRouter>
    );

    expect(screen.getByText('inactive')).toBeInTheDocument();
    expect(screen.getByText('never')).toBeInTheDocument();
  });
});


