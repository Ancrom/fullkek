import axios from "axios";
import { usersApi } from "../../../api/usersApi";
import type { IUserDto } from "../../../types/UserType";
import type { FormikHelpers } from "formik";

export async function submitUserForm(
  values: IUserDto,
  helpers: FormikHelpers<IUserDto>,
  id?: string
): Promise<void> {
  try {
    helpers.setStatus(null);
    if (!id) {
      await usersApi.create(values);
      helpers.resetForm();
      helpers.setStatus({
        type: "success",
        message: "User created successfully",
      });
    } else {
      await usersApi.update(id!, values);
      helpers.setStatus({
        type: "success",
        message: "User updated successfully",
      });
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 409) {
      helpers.setStatus({
        type: "error",
        message: error.response.data.message,
      });
      return;
    }

    helpers.setStatus("Unexpected error");
  } finally {
    helpers.setSubmitting(false);
  }
}
