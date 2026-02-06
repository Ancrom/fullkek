import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Icon from "../../ui/Icons/Icon";
import styles from "./authForm.module.scss";
import { submitAuthForm } from "./AuthForm.submit";
import clsx from "clsx";

export default function AuthForm() {
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{ email: "", password: "" }}
      onSubmit={(v, h) => submitAuthForm(v, h)}
      validationSchema={Yup.object({
        email: Yup.string().email("Invalid email").required("Required"),
        password: Yup.string().min(8, "Min 8 characters").required("Required"),
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
            <div className={styles.field}>
              <label htmlFor="email">Enter your email</label>
              <Field
                id="email"
                name="email"
                type="email"
                placeholder="email@domain.com"
								autoComplete="email"
              />
              <ErrorMessage
                name="email"
                component="div"
                className={styles.error}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="password">Enter your password</label>
              <Field
                id="password"
                name="password"
                type="password"
                placeholder="Password"
								autoComplete="current-password"
              />
              <ErrorMessage
                name="password"
                component="div"
                className={styles.error}
              />
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
              {!isSubmitting && "Login"}
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
