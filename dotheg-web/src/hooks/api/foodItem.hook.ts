import { EntryBase } from "@/data/constant";
import { AppError, FoodItemDTO, FoodItemInfo } from "@/types/index.type";
import { toUrl } from "@/utils";
import { fetcher, updater } from "@/utils/fetch";
import { notifications } from "@mantine/notifications";
import { useQuery, useMutation, UseQueryResult, UseMutationResult } from "@tanstack/react-query";

const base = EntryBase.FOOD_ITEM;

export const useGetFoodItem = (): [UseQueryResult<FoodItemInfo[], Error>, string[]] => {
  const key = [base];
  return [useQuery({ queryKey: key, queryFn: () => fetcher(toUrl(key)) }), key];
};

export const useGetFoodItemById = (id: string): [UseQueryResult<FoodItemInfo, Error>, string[]] => {
  const key = [base, "by-id", id];
  return [useQuery({ queryKey: key, queryFn: () => fetcher(toUrl(key)) }), key];
};

export const useCreateFoodItem = (): [UseMutationResult<FoodItemInfo, AppError, FoodItemDTO, unknown>, string[]] => {
  const key = [base];
  return [
    useMutation({
      mutationFn: (data) =>
        updater(toUrl([base]), {
          method: "POST",
          body: data,
        }),
      onSuccess: () => {
        notifications.show({
          message: "Food item created successfully",
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

export const useImportFoodItem = (): [UseMutationResult<FoodItemInfo, AppError, FormData, unknown>, string[]] => {
  const key = [base];
  return [
    useMutation({
      mutationFn: (data) =>
        updater(toUrl([base, "import"]), {
          method: "POST",
          body: data,
        }),
      onSuccess: () => {
        notifications.show({
          message: "Food item import successfully",
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
export const useUpdateFoodItem = (): [
  UseMutationResult<
    FoodItemInfo,
    AppError,
    {
      id: string;
      data: FoodItemDTO;
    },
    unknown
  >,
  string[]
] => {
  const key = [base];
  return [
    useMutation({
      mutationFn: (param) =>
        updater(toUrl([base, param.id]), {
          method: "PATCH",
          body: param.data,
        }),
      onSuccess: () => {
        notifications.show({
          message: "Food item updated successfully",
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

export const useDeleteFoodItem = (): [UseMutationResult<FoodItemInfo, AppError, string, unknown>, string[]] => {
  const key = [base];
  return [
    useMutation({
      mutationFn: (id) =>
        updater(toUrl([base, id]), {
          method: "DELETE",
        }),
      onSuccess: () => {
        notifications.show({
          message: "Food item deleted successfully",
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
