import { FormAuth } from "@/components/formAuth/formAuth";
import { Message } from "@/components/message/message";
import { Button } from "@/components/ui/button";
import { login } from "@/store/slices/authSlice";
import { createUser } from "@/store/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useCallback, useEffect, useState } from "react";

export function Login() {
  const dispatch = useAppDispatch();
  const { loading: loadingLogin, errors: errorsLogin } = useAppSelector(
    (s) => s.auth
  );
  const { loading: loadingUser, errors: errorsUser, success } = useAppSelector(
    (s) => s.user
  );

  const [isRegister, setIsRegister] = useState(false);

  // Separando melhor os estados
  const [datasLogin, setDatasLogin] = useState({
    email: "",
    password: "",
    name: "",
  });

  // *** Atualizar input ***
  const onHandleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setDatasLogin((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  // *** Login ***
  const onHandleSubmitLogin = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!datasLogin.email || !datasLogin.password) return;
      dispatch(login(datasLogin));
    },
    [datasLogin, dispatch]
  );

  // *** Register ***
  const onHandleSubmitRegister = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!datasLogin.email || !datasLogin.password || !datasLogin.name) return;
      dispatch(createUser(datasLogin));
    },
    [datasLogin, dispatch]
  );

  // Quando registrar sem erro → volta para login
  useEffect(() => {
    if (!loadingUser && !errorsUser) setIsRegister(false);
  }, [loadingUser, errorsUser]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-full sm:w-96">
        {/* Switch Login / Register */}
        <div className="flex justify-between mb-6 gap-2">
          <Button
            className={`w-1/2 ${!isRegister ? "bg-indigo-600" : "bg-gray-600"}`}
            onClick={() => setIsRegister(false)}
          >
            Login
          </Button>
          <Button
            className={`w-1/2 ${isRegister ? "bg-indigo-600" : "bg-gray-600"}`}
            onClick={() => setIsRegister(true)}
          >
            Register
          </Button>
        </div>

        <FormAuth
          datasLogin={datasLogin}
          onHandleChange={onHandleChange}
          onHandleSubmit={
            isRegister ? onHandleSubmitRegister : onHandleSubmitLogin
          }
          loading={isRegister ? loadingUser : loadingLogin}
          isRegister={isRegister}
        />

        {(errorsLogin || errorsUser) && (
          <Message
            datas={{
              message: errorsLogin?.[0]! || errorsUser?.[0]!,
              typeMessage: "error",
            }}
          />
        )}
        {success && (
          <Message
            datas={{
              message: success,
              typeMessage: "success",
            }}
          />
        )}
      </div>
    </div>
  );
}
