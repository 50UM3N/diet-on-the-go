import { EntryBase } from "@/data/constant";
import { queryClient } from "@/main";
import { logout, updateUser } from "@/store/slices/userSlice";
import { AppError, UpdateUserDTO, UserInfo } from "@/types/index.type";
import { toUrl } from "@/utils";
import { fetcher, updater } from "@/utils/fetch";
import { notifications } from "@mantine/notifications";
import { useQuery, useMutation, UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const base = EntryBase.USER;

export const useGetUser = (): [UseQueryResult<UserInfo, Error>, string[]] => {
  const key = [base];
  return [useQuery({ queryKey: key, queryFn: () => fetcher(toUrl(key)) }), key];
};

export const useUpdateUser = (): [UseMutationResult<UserInfo, AppError, UpdateUserDTO>, string[]] => {
  const dispatch = useDispatch();
  const key = [base];
  return [
    useMutation({
      mutationFn: (data) =>
        updater(toUrl([base]), {
          method: "PATCH",
          body: data,
        }),
      onSuccess(_, data) {
        dispatch(updateUser(data));
        queryClient.invalidateQueries({ queryKey: key });
        notifications.show({
          message: "User updated successfully",
        });
      },
      onError(error) {
        notifications.show({
          color: "red",
          message: error.message,
        });
      },
    }),
    key,
  ];
};

export const useDeleteUser = (): [UseMutationResult<UserInfo, AppError, string>, string[]] => {
  const key = [base];
  return [
    useMutation({
      mutationFn: (id) =>
        updater(toUrl([base, id]), {
          method: "DELETE",
        }),
      onSuccess() {
        notifications.show({
          message: "User deleted successfully",
        });
      },
      onError(error) {
        notifications.show({
          color: "red",
          message: error.message,
        });
      },
    }),
    key,
  ];
};

export const useResetUserPassword = (): [UseMutationResult<UserInfo, AppError, { password: string }>, string[]] => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const key = [base, "reset-password"];
  return [
    useMutation({
      mutationFn: (param) =>
        updater(toUrl([base, "reset-password"]), {
          method: "POST",
          body: param,
        }),
      onSuccess() {
        notifications.show({
          message: "Password reset successful",
        });
        dispatch(logout());
        navigate("/login");
      },
      onError(error) {
        notifications.show({
          color: "red",
          message: error.message,
        });
      },
    }),
    key,
  ];
};
