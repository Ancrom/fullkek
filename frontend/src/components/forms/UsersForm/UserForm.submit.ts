import axios from "axios";
import { usersApi } from "../../../api/usersApi";
import type { IUserDto } from "../../../types/UserType";
import type { FormikHelpers } from "formik";

export async function submitUserForm(
  values: IUserDto,
  helpers: FormikHelpers<IUserDto>,
  options: { mode: "create" | "update"; id?: string } = { mode: "create" }
) {
  try {
    helpers.setStatus(null);
    if (options.mode === "create") {
      await usersApi.create(values);
      helpers.resetForm();
      helpers.setStatus({
        type: "success",
        message: "User created successfully",
      });
    } else {
      await usersApi.update(options.id!, values);
      helpers.setStatus({
        type: "success",
        message: "User updated successfully",
      });
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 409) {
      helpers.setStatus(error.response.data.message);
      return;
    }

    helpers.setStatus("Unexpected error");
  } finally {
    helpers.setSubmitting(false);
  }
}
