import UsersForm from "../../components/forms/UsersForm/UserForm";
import MainLayout from "../../layouts/MainLayout/MainLayout";

const initialValues = {
  email: "",
  username: "",
  password: "",
  first_name: "",
  last_name: "",
  avatar_url: "",
  description: "",
  birthday: "",
  phone: "",
};

export default function UsersFormPage() {
  return (
    <MainLayout type="create">
      <UsersForm initialValues={initialValues} />
    </MainLayout>
  );
}
