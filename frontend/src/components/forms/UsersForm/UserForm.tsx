import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import type { IUserDto } from "../../../types/UserType";
import { submitUserForm } from "./UserForm.submit";
import Icon from "../../ui/Icons/Icon";
import styles from "./userForm.module.scss";
import clsx from "clsx";

interface IUsersFormProps {
  initialValues: IUserDto;
  id?: string;
}

export default function UserForm({ initialValues, id }: IUsersFormProps) {
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      onSubmit={(v, h) => submitUserForm(v, h, id)}
      validationSchema={Yup.object({
        email: Yup.string().email("Invalid email").required("Required"),
        username: Yup.string()
          .min(3, "Min 3 characters")
          .max(16, "Max 16 characters")
          .required("Required"),
        password: Yup.string().min(8, "Min 8 characters").required("Required"),
        firstName: Yup.string().max(20, "Max 20 characters"),
        lastName: Yup.string().max(20, "Max 20 characters"),
        avatarUrl: Yup.string().url("Invalid URL").nullable(),
        description: Yup.string().max(100, "Max 100 characters").nullable(),
        birthday: Yup.date().nullable(),
        phoneNumber: Yup.string().max(20, "Max 20 characters"),
      })}
    >
      {({ isSubmitting, status }) => (
        <Form className={styles.form}>
          {status && (
            <div className={clsx(styles.status, styles[status.type])}>
              {status.message}
            </div>
          )}

          <div className={styles.body}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="email">
                  Email<i>*</i>
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@domain.com"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className={styles.error}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="username">
                  Username<i>*</i>
                </label>
                <Field
                  id="username"
                  name="username"
                  type="text"
                  placeholder="APushkin"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className={styles.error}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="password">
                  Password<i>*</i>
                </label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className={styles.error}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="firstName">firstname</label>
                <Field
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Alexander"
                />
                <ErrorMessage
                  name="firstName"
                  component="div"
                  className={styles.error}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="lastName">Lastname</label>
                <Field
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Pushkin"
                />
                <ErrorMessage
                  name="lastName"
                  component="div"
                  className={styles.error}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="avatarUrl">Avatar URL</label>
                <Field
                  id="avatarUrl"
                  name="avatarUrl"
                  type="text"
                  placeholder="www.example.com"
                />
                <ErrorMessage
                  name="avatarUrl"
                  component="div"
                  className={styles.error}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="description">Description</label>
                <Field
                  id="description"
                  name="description"
                  type="text"
                  placeholder="Alexander"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className={styles.error}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="phoneNumber">Phone number</label>
                <Field
                  id="phoneNumber"
                  name="phoneNumber"
                  type="text"
                  placeholder="+0-999-888-77-66"
                />
                <ErrorMessage
                  name="phoneNumber"
                  component="div"
                  className={styles.error}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="birthday">Birthdate</label>
                <Field
                  id="birthday"
                  name="birthday"
                  type="date"
                  placeholder="20.02.2025"
                />
                <ErrorMessage
                  name="birthday"
                  component="div"
                  className={styles.error}
                />
              </div>
            </div>
          </div>
          <div className={styles.buttons}>
            <button
              type="submit"
              className={styles.submit}
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Icon name="spinner" size={19} className={styles.spinner} />
              )}
              {!isSubmitting && "Submit"}
            </button>
            <button type="reset" className={styles.reset}>
              Reset
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
