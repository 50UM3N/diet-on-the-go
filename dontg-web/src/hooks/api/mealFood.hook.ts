import { EntryBase } from "@/data/constant";
import { AppError, CreateMealFoodDto, MealFoodInfo, UpdateMealFoodDto } from "@/types/index.type";
import { toUrl } from "@/utils";
import { fetcher, updater } from "@/utils/fetch";
import { UseMutationResult, UseQueryResult, useMutation, useQuery } from "react-query";

const base = EntryBase.MEAL_FOOD;

export const useGetMealFood = (): [UseQueryResult<MealFoodInfo[], AppError>, string[]] => {
  const key = [base];
  return [useQuery(key, () => fetcher(toUrl(key))), key];
};

export const useCreateMealFood = (): [UseMutationResult<MealFoodInfo, AppError, CreateMealFoodDto, unknown>, string[]] => {
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

export const useUpdateMealFood = (): [
  UseMutationResult<
    MealFoodInfo,
    AppError,
    {
      id: string;
      data: UpdateMealFoodDto;
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

export const useDeleteMealFood = (): [UseMutationResult<MealFoodInfo, AppError, string, unknown>, string[]] => {
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
