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
    refetchInterval: 5000,
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredData = data?.filter((user) => {
    return (
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.username.toLowerCase().includes(search.toLowerCase())
    );
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredData = data?.filter((user) => {
    return (
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.username.toLowerCase().includes(search.toLowerCase())
    );
  });

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
      {filteredData && filteredData.length > 0 ? (
        <ul>
          {filteredData.map((user) => (
            <UserCard user={user} key={user.id} />
          ))}
        </ul>
      ) : (
        <div>No users found</div>
      )}
    </div>
  );
}
