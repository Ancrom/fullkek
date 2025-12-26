import UsersForm from "../../components/forms/UsersForm/UserForm";
import MainLayout from "../../layouts/MainLayout/MainLayout";
import type { IUserDto } from "../../types/UserType";
import { submitUserForm } from "../../components/forms/UsersForm/UserForm.submit";

const initialValues = {
  email: "",
  username: "",
  password: "",
  firstName: "",
  lastName: "",
  avatarUrl: "",
  description: "",
  birthday: "",
  phoneNumber: "",
};

export default function UsersFormPage() {
  const handleSubmit = async (values: IUserDto, helpers: any) => {
    submitUserForm(values, helpers);
  };

  return (
    <MainLayout type="create">
      <UsersForm initialValues={initialValues} onSubmit={handleSubmit} />
    </MainLayout>
  );
}
