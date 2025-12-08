import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/navbar/navbar";
import { Dashboard } from "./pages/dashboard";
import { Login } from "./pages/login";
import { useAuth } from "./utils/checkAuth";
import { PerfilPage } from "./pages/profile";
import { Records } from "./pages/records";
import { Insights } from "./pages/insights";
import { Loading } from "./components/loading/loading";

export function App() {
  const { auth, loading: loadingCheckAuth } = useAuth();

  if (loadingCheckAuth) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <BrowserRouter>
        {auth && <Navbar />}
        <Routes>
          <Route
            path="/"
            element={auth ? <Dashboard /> : <Navigate to="/signin" />}
          />
          <Route
            path="/signin"
            element={auth ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/profile"
            element={auth ? <PerfilPage /> : <Navigate to="/signin" />}
          />
          <Route
            path="/records"
            element={auth ? <Records /> : <Navigate to="/signin" />}
          />
          <Route
            path="/insights"
            element={auth ? <Insights /> : <Navigate to="/signin" />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
