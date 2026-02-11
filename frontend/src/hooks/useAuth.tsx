import { useEffect, useState } from "react";
import { usersApi } from "../api/usersApi";

export const useAuth = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    usersApi
      .getMe()
      .then(() => setIsAuth(true))
      .catch(() => setIsAuth(false))
      .finally(() => setIsLoading(false));
  }, []);

  return { isAuth, isLoading };
};
