import Loader from "@/components/Loader";
import { useAuth } from "@/hooks/api/auth.hook";
import { Navigate, Outlet } from "react-router-dom";

export const AuthProvider = () => {
  const { loading, user } = useAuth();
  if (loading) return <Loader full />;
  else if (user) return <Outlet />;
  return <Navigate to="/login" />;
};

export const NonAuthProvider = () => {
  const { loading, user } = useAuth(false);
  if (loading) return <Loader full />;
  else if (user) return <Navigate to="/" />;
  return <Outlet />;
};
