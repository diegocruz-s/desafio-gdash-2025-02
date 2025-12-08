import { Spinner } from "../ui/spinner";

export function Loading() {
  return (
    <div className="w-full flex justify-center items-center text-white gap-2 mb-8">
      <Spinner /> <p>Carregando</p>
    </div>
  );
}
