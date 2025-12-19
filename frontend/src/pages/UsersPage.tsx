import { Link } from "react-router-dom";
import UsersList from "../components/UsersList/UsersList";

export default function UsersPage() {
  return (
    <div>
      <UsersList />
			<Link to="/users/create">Create user</Link>
    </div>
  );
}
