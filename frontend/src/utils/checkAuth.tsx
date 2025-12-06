import { useAppSelector } from "@/store/store";
import { useEffect, useState } from "react"
import { api } from "./api";

export const useAuth = () => {
  const { datasStorage } = useAppSelector(state => state.auth);
  const [auth, setAuth] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>();

  useEffect(() => {
    setLoading(true);

    if (datasStorage?.accessToken) {
      setAuth(true);
      api.defaults.headers.authorization = `Bearer ${datasStorage.accessToken}`;
    } else {
      setAuth(false);
    }

    setLoading(false);
  }, [datasStorage])

  return { auth, loading };
};
