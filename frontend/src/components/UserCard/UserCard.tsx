import type { IUser } from "../../types/UserType";
import styles from "./userCard.module.scss";
import Icon from "../ui/Icons/Icon";

interface IUserCardProps {
  user: IUser;
}

export default function UserCard({ user }: IUserCardProps) {
  return (
    <li className={styles.userCard}>
      <div className={styles.top}>
        <span>Created at: {user.createdAt}</span>
        <button>
          <Icon name="edit" size={24} className={styles.icon} />
        </button>
      </div>
      <h2 className={styles.title}>{user.username}</h2>
      <div className={styles.bottom}>
        <span>{user.email}</span>
        <span className={styles.role}>
          <span className={styles.highlight}>{user.role}</span>
        </span>
        <span>
          {user.isActive ? (
            <span className={styles.active}>active</span>
          ) : (
            <span className={styles.inactive}>inactive</span>
          )}
        </span>
        <span>
          Last login at:&nbsp;
          <span className={styles.highlight}>
            {user.lastLoginAt || "never"}
          </span>
        </span>
        <span>
          Last login at:&nbsp;
          <span className={styles.highlight}>{user.phoneNumber}</span>
        </span>
      </div>
    </li>
  );
}
