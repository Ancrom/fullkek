import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUsersService } from "../../../services/UserService";
import type { IUser } from "../../../types/UserType";
import UserCard from "../UserCard/UserCard";
import Icon from "../../ui/Icons/Icon";
import styles from "./usersList.module.scss";


export default function UsersList() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = useQuery({
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

  const renderUsers = (users: IUser[]) => {
    return (
      <ul className={styles.list}>
        {users?.map((user) => (
          <UserCard user={user} key={user.id} />
        ))}
      </ul>
    );
  };

  return (
    <div className={styles.usersList}>
      <div className={styles.input}>
        <label htmlFor="usersListInput" className={styles.input}>
          Search user by:
        </label>
        <input
          id="usersListInput"
          type="text"
          placeholder="email or username"
          value={search}
          onChange={onChange}
        />
      </div>

      {/* <button onClick={() => refetch()}>Refetch</button> */}
      {isLoading && <Icon name="spinner" size={24} />}
      {isError && <div>Error</div>}
      {data && data.length === 0 && <div>No users</div>}
      {filteredData && filteredData.length > 0 && renderUsers(filteredData)}
      {filteredData && filteredData.length === 0 && <div>No users found</div>}
    </div>
  );
}
