import { useQuery } from "@tanstack/react-query";
import { UserService } from "../../services/UserService";

export default function UsersList() {
  const users = new UserService();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: () => users.fetchUsers(),
  });

  console.log(data);

  return (
    <div>
      <button onClick={() => refetch()}>Refetch</button>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error</div>}
      {data && data.length === 0 && <div>No users</div>}
      {data &&
        data.map((user) => (
          <div key={user.id}>
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Username</th>
                  <th>EmailVerified</th>
                  <th>CreatedAt</th>
                  <th>Role</th>
                  <th>IsActive</th>
                  <th>LastLoginAt</th>
                  <th>Password</th>
                  <th>FirstName</th>
                  <th>LastName</th>
                  <th>AvatarUrl</th>
                  <th>Description</th>
                  <th>Birthday</th>
                  <th>PhoneNumber</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{user.email}</td>
                  <td>{user.username}</td>
                  <td>{user.emailVerified}</td>
                  <td>{user.createdAt}</td>
                  <td>{user.role}</td>
                  <td>{user.isActive}</td>
                  <td>{user.lastLoginAt && user.lastLoginAt}</td>
                  <td>{user.password}</td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.avatarUrl}</td>
                  <td>{user.description}</td>
                  <td>{user.birthday && user.birthday}</td>
                  <td>{user.phoneNumber}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
    </div>
  );
}
