import { EntryBase } from "@/data/constant";
import { FoodItemDTO, FoodItemInfo } from "@/types/index.type";
import { toUrl } from "@/utils";
import { fetcher, updater } from "@/utils/fetch";
import { UseMutationResult, UseQueryResult, useMutation, useQuery } from "react-query";

const base = EntryBase.FOOD_ITEM;

export const useGetFoodItem = (): [UseQueryResult<FoodItemInfo[], Error>, string[]] => {
  const key = [base];
  return [useQuery<FoodItemInfo[], Error>(key, () => fetcher(toUrl(key))), key];
};

export const useGetFoodItemById = (id: string): [UseQueryResult<FoodItemInfo, Error>, string[]] => {
  const key = [base, "by-id", id];
  return [useQuery<FoodItemInfo, Error>(key, () => fetcher(toUrl(key))), key];
};

export const useCreateFoodItem = (): [UseMutationResult<any, unknown, FoodItemDTO, unknown>, string[]] => {
  const key = [base];
  return [
    useMutation((data: FoodItemDTO) =>
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
    any,
    unknown,
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

export const useDeleteFoodItem = (): [UseMutationResult<any, unknown, string, unknown>, string[]] => {
  const key = [base];
  return [
    useMutation((id: string) =>
      updater(toUrl([base, id]), {
        method: "DELETE",
      })
    ),
    key,
  ];
};
