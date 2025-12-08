"use client";

import { Message } from "@/components/message/message";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { logout } from "@/store/slices/authSlice";
import { readUserById, updateUser, deleteUser } from "@/store/slices/userSlice";
import { type AppDispatch, useAppSelector } from "@/store/store";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export function PerfilPage() {
  const dispatch = useDispatch<AppDispatch>();

  const { datasStorage } = useAppSelector((s) => s.auth);
  const { user, success, errors, loading } = useAppSelector((s) => s.user);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  useEffect(() => {
    if (datasStorage?.id) dispatch(readUserById(datasStorage.id));
  }, [datasStorage?.id, dispatch]);

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name ?? "",
        email: user.email ?? "",
      }));
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    dispatch(
      updateUser({
        userId: user.id,
        datas: {
          name: form.name || undefined,
          email: form.email || undefined,
          password: form.password || undefined,
        },
      })
    );
  };

  const onSumitDelete = async (id: string) => {
    await dispatch(deleteUser(id));
    await dispatch(logout());
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-xl w-full sm:w-[420px]">
        <h1 className="text-2xl font-bold text-center mb-6">
          Perfil do Usuário
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* ------------ ID (somente leitura) ------------ */}
          <div>
            <p className="text-gray-400 text-sm">ID</p>
            <p className="text-xs font-mono bg-gray-700 p-2 rounded mt-1 truncate">
              {user?.id ?? "Carregando..."}
            </p>
          </div>

          {/* ------------ Nome ------------ */}
          <label className="text-sm">
            Nome
            <Input
              name="name"
              value={form.name}
              onChange={onChange}
              className="mt-1 bg-gray-700 text-white border-gray-600"
            />
          </label>

          {/* ------------ Email ------------ */}
          <label className="text-sm">
            Email
            <Input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              className="mt-1 bg-gray-700 text-white border-gray-600"
            />
          </label>

          {/* ------------ Nova Senha (opcional) ------------ */}
          <label className="text-sm">
            Nova Senha
            <Input
              name="password"
              type="password"
              placeholder="Preencha apenas se deseja alterar"
              value={form.password}
              onChange={onChange}
              className="mt-1 bg-gray-700 text-white border-gray-600"
            />
          </label>

          <Button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700"
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </form>

        {/* Delete com confirmação */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="mt-4 w-full">
              Deletar Conta
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent className="text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>
                Tem certeza que deseja deletar sua conta?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação é irreversível. Todos seus dados serão removidos do
                sistema.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-700 text-white border-gray-600">
                Cancelar
              </AlertDialogCancel>

              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={() => user && onSumitDelete(user.id)}
              >
                Sim, deletar conta
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Feebacks */}
        {errors && (
          <Message datas={{ message: errors[0], typeMessage: "error" }} />
        )}
        {success && (
          <Message datas={{ message: success, typeMessage: "success" }} />
        )}
      </div>
    </div>
  );
}
