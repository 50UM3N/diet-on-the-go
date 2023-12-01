import { EntryBase } from "@/data/constant";
import { AppError, FoodItemDTO, FoodItemInfo } from "@/types/index.type";
import { toUrl } from "@/utils";
import { fetcher, updater } from "@/utils/fetch";
import { UseMutationResult, UseQueryResult, useMutation, useQuery } from "react-query";

const base = EntryBase.FOOD_ITEM;

export const useGetFoodItem = (): [UseQueryResult<FoodItemInfo[], Error>, string[]] => {
  const key = [base];
  return [useQuery(key, () => fetcher(toUrl(key))), key];
};

export const useGetFoodItemById = (id: string): [UseQueryResult<FoodItemInfo, Error>, string[]] => {
  const key = [base, "by-id", id];
  return [useQuery(key, () => fetcher(toUrl(key))), key];
};

export const useCreateFoodItem = (): [UseMutationResult<FoodItemInfo, AppError, FoodItemDTO, unknown>, string[]] => {
  const key = [base];
  return [
    useMutation((data) =>
      updater(toUrl([base]), {
        method: "POST",
        body: data,
      })
    ),
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
    useMutation((param) =>
      updater(toUrl([base, param.id]), {
        method: "PATCH",
        body: param.data,
      })
    ),
    key,
  ];
};

export const useDeleteFoodItem = (): [UseMutationResult<FoodItemInfo, AppError, string, unknown>, string[]] => {
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
