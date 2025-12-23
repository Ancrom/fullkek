import { useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout/MainLayout";

export default function UserPage() {
  const { id } = useParams();

  return (
    <MainLayout>
      <div>user {id}</div>
    </MainLayout>
  );
}
