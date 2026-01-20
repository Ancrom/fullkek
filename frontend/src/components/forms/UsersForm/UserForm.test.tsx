import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { IUserDto } from '../../../types/UserType';
import UserForm from './UserForm';

const submitUserFormMock = vi.fn();
vi.mock('./UserForm.submit', () => {
  return {
    submitUserForm: (...args: unknown[]) => submitUserFormMock(...args),
  };
});

const INITIAL: IUserDto = {
  email: '',
  username: '',
  password: '',
  // Formik <Field /> works best with empty strings for optional text inputs
  firstName: '',
  lastName: '',
  avatarUrl: '',
  description: '',
  birthday: '',
  phone: '',
};

describe('UserForm', () => {
  it('renders form fields and buttons', () => {
    render(<UserForm initialValues={INITIAL} />);

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
  });

  it('shows validation errors on submit (user action)', async () => {
    submitUserFormMock.mockResolvedValue(undefined);
    render(<UserForm initialValues={INITIAL} />);

    await userEvent.type(screen.getByLabelText(/Email/i), 'not-an-email');
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByText('Invalid email')).toBeInTheDocument();
    expect(submitUserFormMock).not.toHaveBeenCalled();
  });

  it('shows loading state during submit (spinner + disabled)', async () => {
    submitUserFormMock.mockImplementation(() => new Promise(() => {}));
    const { container } = render(<UserForm initialValues={INITIAL} />);

    await userEvent.type(screen.getByLabelText(/Email/i), 'a@b.com');
    await userEvent.type(screen.getByLabelText(/Username/i), 'abc');
    await userEvent.type(screen.getByLabelText(/Password/i), 'password1');

    const submitBtn = screen.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitBtn);

    await waitFor(() => expect(submitBtn).toBeDisabled());
    expect(submitUserFormMock).toHaveBeenCalledTimes(1);
    expect(container.querySelector('use[href="#icon-spinner"]')).toBeInTheDocument();
  });

  it('renders status message set by submit handler', async () => {
    submitUserFormMock.mockImplementation((_values: IUserDto, helpers: any) => {
      helpers.setStatus({ type: 'success', message: 'OK' });
      helpers.setSubmitting(false);
      return Promise.resolve();
    });

    render(<UserForm initialValues={INITIAL} />);

    await userEvent.type(screen.getByLabelText(/Email/i), 'a@b.com');
    await userEvent.type(screen.getByLabelText(/Username/i), 'abc');
    await userEvent.type(screen.getByLabelText(/Password/i), 'password1');
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByText('OK')).toBeInTheDocument();
  });
});


