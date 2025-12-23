import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUsersService } from "../../services/UserService";
import UserCard from "../UserCard/UserCard";
import styles from "./usersList.module.scss";

export default function UsersList() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsersService(),
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  console.log(data);

  return (
    <div className={styles.usersList}>
      <h1 className={styles.title}>Users list</h1>
      <label htmlFor="usersListInput" className={styles.input}>
        <span>Search user by:</span>
        <input
          id="usersListInput"
          type="text"
          placeholder="email or username"
          value={search}
          onChange={onChange}
        />
      </label>
      {/* <button onClick={() => refetch()}>Refetch</button> */}
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error</div>}
      {data && data.length === 0 && <div>No users</div>}
      {data && (
        <ul>
          {data.map((user) => (
            <UserCard user={user} key={user.id} />
          ))}
        </ul>
      )}
    </div>
  );
}
