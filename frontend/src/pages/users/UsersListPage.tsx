import MainLayout from "../../layouts/MainLayout/MainLayout";
import UsersList from "../../components/users/UsersList/UsersList";

export default function UsersListPage() {
  return (
    <MainLayout type="users">
      <UsersList />
    </MainLayout>
  );
}
