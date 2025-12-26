import UsersForm from "../../components/forms/UsersForm/UserForm";
import MainLayout from "../../layouts/MainLayout/MainLayout";

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
  return (
    <MainLayout type="create">
      <UsersForm initialValues={initialValues} />
    </MainLayout>
  );
}
