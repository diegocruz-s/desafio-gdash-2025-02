import { Button } from "@/components/ui/button";
import { logout } from "@/store/slices/authSlice";
import { type AppDispatch } from "@/store/store";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

export function Navbar() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const onHandleLogout = async () => {
    await dispatch(logout());
    navigate("/");
  };

  const links = [
    { name: "Dashboard", path: "/" },
    { name: "Registros", path: "/records" },
    { name: "Insights", path: "/insights" },
    { name: "Perfil", path: "/profile" },
  ];

  return (
    <nav className="sticky top-0 left-0 w-full bg-zinc-900 text-white px-8 py-4 shadow-lg z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <h1 className="flex gap-2 items-center text-xl font-semibold">
          🌦 WeatherControl
        </h1>

        {/* MOBILE BTN */}
        <button
          className="md:hidden text-xl"
          onClick={() => setOpen((prev) => !prev)}
        >
          ☰
        </button>

        {/* LINKS DESKTOP */}
        <div className="hidden md:flex gap-8">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`hover:text-gray-300
                ${
                  location.pathname === link.path
                    ? "text-blue-400 font-semibold"
                    : ""
                }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* USER + LOGOUT */}
        <div className="hidden md:flex items-center gap-3">
          {/* <span className="text-sm text-gray-300">Olá, {datasStorage?.user.name}</span> */}
          <Button
            className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded"
            onClick={onHandleLogout}
          >
            Sair
          </Button>
        </div>
      </div>

      {/* MENU MOBILE */}
      {open && (
        <div className="flex flex-col mt-4 gap-4 md:hidden">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setOpen(false)}
              className={`block py-2
                ${
                  location.pathname === link.path
                    ? "text-blue-400 font-semibold"
                    : "text-gray-300"
                }`}
            >
              {link.name}
            </Link>
          ))}

          <Button className="bg-red-600 hover:bg-red-700 w-fit px-4 py-1">
            Sair
          </Button>
        </div>
      )}
    </nav>
  );
}
