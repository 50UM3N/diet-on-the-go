import { EntryBase } from "@/data/constant";
import { AppError, CreateMealListDTO, MealListInfo, UpdateMealListDTO } from "@/types/index.type";
import { toUrl } from "@/utils";
import { fetcher, updater } from "@/utils/fetch";
import { notifications } from "@mantine/notifications";
import { useQuery, useMutation, UseQueryResult, UseMutationResult } from "@tanstack/react-query";

const base = EntryBase.MEAL_LIST;

export const useGetMealList = (): [UseQueryResult<MealListInfo[], AppError>, string[]] => {
  const key = [base];
  return [useQuery({ queryKey: key, queryFn: () => fetcher(toUrl(key)) }), key];
};

export const useGetMealListById = (id: string): [UseQueryResult<MealListInfo, AppError>, string[]] => {
  const key = [base, "by-id", id];
  return [useQuery({ queryKey: key, queryFn: () => fetcher(toUrl(key)) }), key];
};

interface GetMealListByChartIdDTO {
  protein: number;
  fat: number;
  carb: number;
  mealList: (MealListInfo & { protein: number; fat: number; carb: number })[];
}

export const useGetMealListByChartId = (id: string): [UseQueryResult<GetMealListByChartIdDTO, AppError>, string[]] => {
  const key = [base, "by-chart-id", id];
  return [useQuery({ queryKey: key, queryFn: () => fetcher(toUrl(key)) }), key];
};

export const useCreateMealList = (): [UseMutationResult<MealListInfo, AppError, CreateMealListDTO, unknown>, string[]] => {
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
          message: "Meal list created successfully",
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
    useMutation({
      mutationFn: (param) =>
        updater(toUrl([base, param.id]), {
          method: "PATCH",
          body: param.data,
        }),
      onSuccess: () => {
        notifications.show({
          message: "Meal list updated successfully",
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

export const useDeleteMealList = (): [UseMutationResult<MealListInfo, AppError, string, unknown>, string[]] => {
  const key = [base];
  return [
    useMutation({
      mutationFn: (id) => updater(toUrl([base, id]), { method: "DELETE" }),
      onSuccess: () => {
        notifications.show({
          message: "Meal list deleted successfully",
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
