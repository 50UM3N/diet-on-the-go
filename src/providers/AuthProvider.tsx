import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import Loader from "../components/Loader";
import AppShell from "../layouts/AppShell";

const AuthProvider = () => {
    const user = useSelector<RootState, UserState>((state) => state.user);
    if (user.isLoading) {
        return <Loader />;
    } else if (user.user) {
        return (
            <AppShell>
                <Outlet />
            </AppShell>
        );
    } else {
        return <Navigate to="/login" />;
    }
};

export default AuthProvider;
