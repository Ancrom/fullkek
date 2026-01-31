import axios from "axios";

export const api = axios.create({
  baseURL: "/api/",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      (error.response && error.response.status === 401) ||
      error.response.status === 403
    ) {
      const currentUrl = window.location.pathname + window.location.search;
      sessionStorage.setItem("redirect", currentUrl);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
