import MainLayout from "../../layouts/MainLayout/MainLayout";
import UsersForm from "../../components/forms/UsersForm/UserForm";
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
  return (
    <MainLayout type="edit">
      {isLoading && <Icon name="spinner" size={24} />}
      {isError && <div>{error.message}</div>}
      {user && <UsersForm initialValues={user} id={id} />}
    </MainLayout>
  );
}
