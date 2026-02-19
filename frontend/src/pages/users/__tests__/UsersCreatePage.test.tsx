import { render, screen } from '@testing-library/react';
import UsersCreatePage from '../UsersCreatePage';

vi.mock('../../../layouts/MainLayout/MainLayout', () => ({
  default: ({ children, type }: { children: React.ReactNode; type?: string }) => (
    <div data-testid="main-layout" data-type={type}>
      {children}
    </div>
  ),
}));

const UserFormMock = vi.fn((_props: any) => <form data-testid="user-form" />);
vi.mock('../../../components/forms/UsersForm/UserForm', () => ({
  __esModule: true,
  default: (props: any) => UserFormMock(props),
}));

describe('UsersCreatePage', () => {
  it('renders create layout and passes empty initialValues to form', () => {
    render(<UsersCreatePage />);

    expect(screen.getByTestId('main-layout')).toHaveAttribute('data-type', 'create');
    expect(screen.getByTestId('user-form')).toBeInTheDocument();

    expect(UserFormMock).toHaveBeenCalledTimes(1);
    const { initialValues } = UserFormMock.mock.calls[0][0];
    expect(initialValues).toMatchObject({
      email: '',
      username: '',
      password: '',
    });
  });
});


