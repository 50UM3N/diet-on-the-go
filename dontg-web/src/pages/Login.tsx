import { Button, Center } from "@mantine/core";
import { IconBrandGoogle } from "@tabler/icons-react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router";
import firebaseApp from "../firebase";

const Login = () => {
    const user = useSelector<RootState, UserState>((state) => state.user);
    const navigate = useNavigate();
    const handleAuth = () => {
        const auth = getAuth(firebaseApp);
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                navigate("/");
            })
            .catch((error) => {
                GoogleAuthProvider.credentialFromError(error);
            });
    };
    if (user.user) return <Navigate to="/" />;
    return (
        <Center style={{ height: "100vh", width: "100%" }}>
            <Button
                loading={user.isLoading}
                leftSection={<IconBrandGoogle size={14} />}
                onClick={handleAuth}
            >
                Connect to Google
            </Button>
        </Center>
    );
};

export default Login;
