import AuthForm from "../forms/AuthForm/AuthForm";
import styles from "./login.module.scss";
import clsx from "clsx";

export default function Login() {
  return (
    <div className={styles.login}>
      <div className={clsx("container", styles.container)}>
        <div className={styles.body}>
          <h1 className={styles.title}>Login screen</h1>
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
