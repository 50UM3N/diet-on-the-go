import { EntryBase } from "@/data/constant";
import { logout, updateUser } from "@/store/slices/userSlice";
import { AppError, UpdateUserDTO, UserInfo } from "@/types/index.type";
import { toUrl } from "@/utils";
import { fetcher, updater } from "@/utils/fetch";
import { UseMutationResult, UseQueryResult, useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const base = EntryBase.USER;

export const useGetUser = (): [UseQueryResult<UserInfo, Error>, string[]] => {
  const key = [base];
  return [useQuery<UserInfo, Error>(key, () => fetcher(toUrl(key))), key];
};

export const useUpdateUser = (): [
  UseMutationResult<
    UserInfo,
    AppError,
    {
      id: string;
      data: UpdateUserDTO;
    },
    unknown
  >,
  string[]
] => {
  const query = useQueryClient();
  const dispatch = useDispatch();
  const key = [base];
  return [
    useMutation(
      (param) =>
        updater(toUrl([base]), {
          method: "PATCH",
          body: param.data,
        }),
      {
        onSuccess(data, variable) {
          dispatch(updateUser(variable.data));
          query.invalidateQueries(["user"]);
        },
        onError(error: any) {},
      }
    ),
    key,
  ];
};

export const useDeleteUser = (): [UseMutationResult<UserInfo, AppError, string, unknown>, string[]] => {
  const key = [base];
  return [
    useMutation((id) =>
      updater(toUrl([base, id]), {
        method: "DELETE",
      })
    ),
    key,
  ];
};

export const useResetUserPassword = (): [UseMutationResult<UserInfo, AppError, { password: string }, unknown>, string[]] => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const key = [base, "reset-password"];
  return [
    useMutation(
      (param) =>
        updater(toUrl([base, "reset-password"]), {
          method: "PATCH",
          body: param,
        }),
      {
        onSuccess() {
          dispatch(logout());
          navigate("/login");
        },
        onError(error: any) {},
      }
    ),
    key,
  ];
};
