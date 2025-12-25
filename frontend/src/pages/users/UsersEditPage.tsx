import MainLayout from "../../layouts/MainLayout/MainLayout";
import UsersForm from "../../components/forms/UsersForm/UserForm";
import type { IUserDto } from "../../types/UserType";
import { usersApi } from "../../api/usersApi";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchUserByIdService } from "../../services/UserService";
import Icon from "../../components/ui/Icons/Icon";

export default function UsersEditPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUserByIdService(id!),
  });

  const handleSubmit = async (values: IUserDto, helpers: any) => {
    try {
      helpers.setStatus(null);
      await usersApi.update(id!, values);
      helpers.setStatus({
        type: "success",
        message: "User updated successfully",
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

  console.log(user);

  return (
    <MainLayout type="edit">
      {isLoading && <Icon name="spinner" size={24} />}
      {isError && <div>{error.message}</div>}
      {user && <UsersForm initialValues={user} onSubmit={handleSubmit} />}
    </MainLayout>
  );
}
