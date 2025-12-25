import styles from "./mainLayout.module.scss";
import Header from "../Header/Header";
import clsx from "clsx";
import "../../styles/_container.scss";

type LayoutType = "default" | "users" | "create" | "edit";
interface IMainLayoutProps {
  children: React.ReactNode;
  type?: LayoutType;
}

const titles: Record<LayoutType, string> = {
  default: "Fullkek",
  users: "Users list",
  create: "User creation form",
  edit: "User edit form",
};

export default function MainLayout({
  children,
  type = "default",
}: IMainLayoutProps) {
  return (
    <div className={clsx(styles.mainLayout, styles[type])}>
      <Header />
      <main className={styles.main}>
        {type !== "default" && (
          <div className="container">
            <h1 className={styles.title}>{titles[type]}</h1>
          </div>
        )}
        <div className="container">{children}</div>
      </main>
    </div>
  );
}
