import { EntryBase } from "@/data/constant";
import { AppError, CreateMealListDTO, MealListInfo, UpdateMealListDTO } from "@/types/index.type";
import { toUrl } from "@/utils";
import { fetcher, updater } from "@/utils/fetch";
import { UseMutationResult, UseQueryResult, useMutation, useQuery } from "react-query";

const base = EntryBase.MEAL_LIST;

export const useGetMealList = (): [UseQueryResult<MealListInfo[], AppError>, string[]] => {
  const key = [base];
  return [useQuery(key, () => fetcher(toUrl(key))), key];
};

export const useGetMealListById = (id: string): [UseQueryResult<MealListInfo, AppError>, string[]] => {
  const key = [base, "by-id", id];
  return [useQuery(key, () => fetcher(toUrl(key))), key];
};

interface GetMealListByChartIdDTO {
  protein: number;
  fat: number;
  carb: number;
  mealList: (MealListInfo & { protein: number; fat: number; carb: number })[];
}

export const useGetMealListByChartId = (id: string): [UseQueryResult<GetMealListByChartIdDTO, AppError>, string[]] => {
  const key = [base, "by-chart-id", id];
  return [useQuery(key, () => fetcher(toUrl(key))), key];
};

export const useCreateMealList = (): [UseMutationResult<MealListInfo, AppError, CreateMealListDTO, unknown>, string[]] => {
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

export const useUpdateMealList = (): [
  UseMutationResult<
    any,
    AppError,
    {
      id: string;
      data: UpdateMealListDTO;
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

export const useDeleteMealList = (): [UseMutationResult<MealListInfo, AppError, string, unknown>, string[]] => {
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
