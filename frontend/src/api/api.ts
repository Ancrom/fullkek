import axios from "axios";

export const api = axios.create({
  baseURL: "/api/",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !error.config._isRetry) {
      originalRequest._isRetry = true;
      try {
        await api.post("/auth/refresh", {}, { withCredentials: true });
        return api.request(originalRequest);
      } catch (e) {
        const currentPath = encodeURIComponent(
          window.location.pathname + window.location.search,
        );
        window.location.href = `/login?redirect=${currentPath}`;
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  },
);
