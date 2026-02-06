import axios from "axios";
import { usersApi } from "../../../api/usersApi";
import type { FormikHelpers } from "formik";

export async function submitAuthForm(
  values: { email: string; password: string },
  helpers: FormikHelpers<{ email: string; password: string }>,
): Promise<void> {
  try {
    helpers.setStatus(null);
    await usersApi.login(values);
    const params = new URLSearchParams(window.location.search);
		const redirect = params.get("redirect");
		window.location.href = redirect || "/users";
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      (error.response?.status === 401 ||
        error.response?.status === 400 ||
        error.response?.status === 403)
    ) {
      helpers.setStatus({
        type: "error",
        message: error.response.data.message,
      });
    }
  } finally {
    helpers.setSubmitting(false);
  }
}
