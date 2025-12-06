import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";

interface AuthFormProps {
  datasLogin: {
    email: string;
    password: string;
    name: string;
  };
  onHandleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onHandleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  isRegister: boolean;
}

export function FormAuth({
  datasLogin,
  loading,
  onHandleChange,
  onHandleSubmit,
  isRegister
}: AuthFormProps) {
  return (
    <form onSubmit={onHandleSubmit} className="space-y-6">
      {isRegister && (
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium">Name</label>
          <Input
            required
            id="name"
            type="text"
            value={datasLogin.name || ''}
            name="name"
            onChange={onHandleChange}
            placeholder="Type your name"
            className="w-full bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      )}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <Input
          required
          id="email"
          type="email"
          value={datasLogin.email}
          name="email"
          onChange={onHandleChange}
          placeholder="Type your email"
          className="w-full bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <Input
          required
          id="password"
          type="password"
          value={datasLogin.password}
          name="password"
          onChange={onHandleChange}
          placeholder="Type your password"
          className="w-full bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {loading ? (
        <Button
          type="button"
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md cursor-not-allowed"
          disabled
        >
          <Spinner />
          Wait
        </Button>
      ) : (
        <Button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {isRegister ? 'Register' : 'Login'}
        </Button>
      )}
    </form>
  );
}
