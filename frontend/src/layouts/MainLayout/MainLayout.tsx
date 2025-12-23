import styles from "./mainLayout.module.scss";
import Header from "../Header/Header";

interface IMainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout(props: IMainLayoutProps) {
  return (
    <div className={styles.mainLayout}>
      <div className={styles.container}>
        <Header />
        {props.children}
      </div>
    </div>
  );
}
