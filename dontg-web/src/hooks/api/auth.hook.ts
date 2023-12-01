import { RootState } from "@/store";
import { login } from "@/store/slices/userSlice";
import { LoginDTO, SignUpDTO } from "@/types/auth.type";
import { UserInfo } from "@/types/index.type";
import { notifications } from "@mantine/notifications";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const AUTH_KEYS = [];

export const useAuth: (redirect?: boolean) => {
  loading: boolean;
  user: UserInfo | null;
} = (redirect = true) => {
  const user = useSelector<RootState, UserInfo | null>((state) => state.user.user);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      if (user) {
        setLoading(false);
        return;
      }
      try {
        const token = localStorage.getItem("token");

        if (!token) throw Error("Token not found");
        if (user) throw Error("User already in");

        const res = await fetch(import.meta.env.APP_BASE_API + "/auth", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            Authorization: "Bearer " + token,
          },
        });

        if (!res.ok) throw Error("Error while validating");

        const data = await res.json();
        dispatch(login(data));
        setLoading(false);
      } catch (error) {
        redirect && navigate("/login", { replace: true });
        setLoading(false);
      }
    })();
  }, [dispatch, navigate, user, redirect]);

  return { loading, user };
};

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userLogin = useCallback(
    async (data: LoginDTO) => {
      setLoading(true);
      try {
        const res = await fetch(import.meta.env.APP_BASE_API + "/auth/login", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem("token", data.token);
          dispatch(login(data.user));
          navigate("/", { replace: true });
        } else {
          const data = await res.json();
          throw Error(data.message);
        }
      } catch (error: any) {
        setLoading(false);
        notifications.show({
          color: "red",
          message: error.message,
        });
      }
    },
    [dispatch, navigate]
  );

  return { loading, userLogin };
};

export const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const userSignUp = useCallback(
    async (data: SignUpDTO) => {
      setLoading(true);
      try {
        const res = await fetch(import.meta.env.APP_BASE_API + "/auth/sign-up", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem("token", data.token);
          dispatch(login(data.user));
          navigate("/", { replace: true });
        } else {
          const data = await res.json();
          throw Error(data.message);
        }
      } catch (error: unknown) {
        setLoading(false);
        // ToastAndroid.show(error.message, ToastAndroid.SHORT);
      }
    },
    [dispatch, navigate]
  );

  return { loading, userSignUp };
};
