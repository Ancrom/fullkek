import axios from "axios";
import type { FormikHelpers } from "formik";
import type { NavigateFunction } from "react-router-dom";

interface IsubmitAuthArgs {
  dto: { email: string; password: string };
  helpers: FormikHelpers<{ email: string; password: string }>;
  hooks: {
    navigate: NavigateFunction;
    searchParams: URLSearchParams;
    login: (dto: IsubmitAuthArgs["dto"]) => Promise<void>;
  };
}

export async function submitAuthForm(
  dto: IsubmitAuthArgs["dto"],
  helpers: IsubmitAuthArgs["helpers"],
  hooks: IsubmitAuthArgs["hooks"],
): Promise<void> {
  try {
    helpers.setStatus(null);
    await hooks.login(dto);
    const redirect = hooks.searchParams.get("redirect") || "/users";
    hooks.navigate(redirect);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "An error occurred";
      helpers.setStatus({ type: "error", message });
    }
  } finally {
    helpers.setSubmitting(false);
  }
}
