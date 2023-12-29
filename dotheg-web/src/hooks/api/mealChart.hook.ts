import { EntryBase } from "@/data/constant";
import { queryClient } from "@/main";
import { AppError, CreateCopyMealChartDTO, CreateMealChartDTO, MealChartInfo, UpdateMealChartDTO } from "@/types/index.type";
import { toUrl } from "@/utils";
import { fetcher, updater } from "@/utils/fetch";
import { notifications } from "@mantine/notifications";
import { useQuery, useMutation, UseQueryResult, UseMutationResult } from "@tanstack/react-query";

const base = EntryBase.MEAL_CHART;

export const useGetMealChart = (): [UseQueryResult<MealChartInfo[], AppError>, string[]] => {
  const key = [base];
  return [useQuery({ queryKey: key, queryFn: () => fetcher(toUrl(key)) }), key];
};

export const useGetMealChartById = (id: string): [UseQueryResult<MealChartInfo, AppError>, string[]] => {
  const key = [base, "by-id", id];
  return [useQuery({ queryKey: key, queryFn: () => fetcher(toUrl(key)) }), key];
};

export const useGetMealChartByChartId = (id: string): [UseQueryResult<MealChartInfo[], AppError>, string[]] => {
  const key = [base, "by-chart-id", id];
  return [useQuery({ queryKey: key, queryFn: () => fetcher(toUrl(key)) }), key];
};

export const useCreateMealChart = (): [UseMutationResult<MealChartInfo, AppError, CreateMealChartDTO, unknown>, string[]] => {
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
          message: "Meal Chart created successfully",
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

export const useCopyMealChart = (): [UseMutationResult<MealChartInfo, AppError, CreateCopyMealChartDTO, unknown>, string[]] => {
  const key = [base];
  return [
    useMutation({
      mutationFn: (data) =>
        updater(toUrl([base, "copy"]), {
          method: "POST",
          body: data,
        }),
      onMutate: () => {
        notifications.show({
          message: "Start copying...",
        });
      },
      onSuccess: () => {
        notifications.update({
          message: "Meal Chart copied successfully",
        });
        queryClient.invalidateQueries();
        console.log("success");
      },
      onError(error) {
        notifications.update({ color: "red", message: error.message });
      },
    }),
    key,
  ];
};

export const useUpdateMealChart = (): [
  UseMutationResult<
    any,
    AppError,
    {
      id: string;
      data: UpdateMealChartDTO;
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
          message: "Meal Chart updated successfully",
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

export const useDeleteMealChart = (): [UseMutationResult<MealChartInfo, AppError, string, unknown>, string[]] => {
  const key = [base];
  return [
    useMutation({
      mutationFn: (id) => updater(toUrl([base, id]), { method: "DELETE" }),
      onSuccess: () => {
        notifications.show({
          message: "Meal Chart deleted successfully",
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
