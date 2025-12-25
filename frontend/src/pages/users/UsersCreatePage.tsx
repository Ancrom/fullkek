import UsersForm from "../../components/forms/UsersForm/UserForm";
import MainLayout from "../../layouts/MainLayout/MainLayout";
import type { IUserDto } from "../../types/UserType";
import { usersApi } from "../../api/usersApi";
import axios from "axios";

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
    try {
      helpers.setStatus(null);
      await usersApi.create(values);

      helpers.resetForm();
      helpers.setStatus({
        type: "success",
        message: "User created successfully",
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        helpers.setStatus(error.response.data.message);
        return;
      }

      helpers.setStatus("Unexpected error");
    } finally {
      helpers.setSubmitting(false);
    }
  };

  return (
    <MainLayout type="create">
      <UsersForm initialValues={initialValues} onSubmit={handleSubmit} />
    </MainLayout>
  );
}
