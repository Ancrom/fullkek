import { render, screen, waitFor } from '@testing-library/react';
import type { IUser } from '../../../types/UserType';
import UsersEditPage from '../UsersEditPage';

vi.mock('../../../layouts/MainLayout/MainLayout', () => ({
  default: ({ children, type }: { children: React.ReactNode; type?: string }) => (
    <div data-testid="main-layout" data-type={type}>
      {children}
    </div>
  ),
}));

const useParamsMock = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useParams: () => useParamsMock(),
  };
});

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

const UserFormMock = vi.fn((_props: any) => <form data-testid="user-form" />);
vi.mock('../../../components/forms/UsersForm/UserForm', () => ({
  __esModule: true,
  default: (props: any) => UserFormMock(props),
}));

describe('UsersEditPage', () => {
  it('renders loading state while user is being loaded', () => {
    useParamsMock.mockReturnValue({ id: '1' });
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    });

    const { container } = render(<UsersEditPage />);

    expect(screen.getByTestId('main-layout')).toHaveAttribute('data-type', 'edit');
    // spinner icon
    expect(container.querySelector('use[href="#icon-spinner"]')).toBeInTheDocument();
  });

  it('renders error state when request fails', () => {
    useParamsMock.mockReturnValue({ id: '1' });
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: { message: 'Failed to load' },
    });

    render(<UsersEditPage />);

    expect(screen.getByText('Failed to load')).toBeInTheDocument();
    expect(UserFormMock).not.toHaveBeenCalled();
  });

  it('renders form when user data is loaded', async () => {
    useParamsMock.mockReturnValue({ id: '123' });

    const user: IUser = {
      id: '123',
      email: 'email@domain.com',
      username: 'username',
      emailConfirmed: true,
      createdAt: '',
      role: 'user',
      isActive: true,
      lastLoginAt: null,
      password: '',
      firstName: null,
      lastName: null,
      avatarUrl: null,
      description: null,
      birthday: null,
      phone: null,
    };

    mockUseQuery.mockReturnValue({
      data: user,
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<UsersEditPage />);

    await waitFor(() => {
      expect(UserFormMock).toHaveBeenCalledTimes(1);
    });

    const props = UserFormMock.mock.calls[0][0];
    expect(props.initialValues).toEqual(user);
    expect(props.id).toBe('123');
  });
});


