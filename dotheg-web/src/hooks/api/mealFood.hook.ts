import { EntryBase } from "@/data/constant";
import { AppError, CreateMealFoodDto, MealFoodInfo, UpdateMealFoodDto } from "@/types/index.type";
import { toUrl } from "@/utils";
import { fetcher, updater } from "@/utils/fetch";
import { notifications } from "@mantine/notifications";
import { useQuery, useMutation, UseQueryResult, UseMutationResult } from "@tanstack/react-query";

const base = EntryBase.MEAL_FOOD;

export const useGetMealFood = (): [UseQueryResult<MealFoodInfo[], AppError>, string[]] => {
  const key = [base];
  return [useQuery({ queryKey: key, queryFn: () => fetcher(toUrl(key)) }), key];
};

export const useCreateMealFood = (): [UseMutationResult<MealFoodInfo, AppError, CreateMealFoodDto, unknown>, string[]] => {
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
          message: "Meal food created successfully",
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
    useMutation({
      mutationFn: (param) =>
        updater(toUrl([base, param.id]), {
          method: "PATCH",
          body: param.data,
        }),
      onSuccess: () => {
        notifications.show({
          message: "Meal food updated successfully",
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

export const useDeleteMealFood = (): [UseMutationResult<MealFoodInfo, AppError, string, unknown>, string[]] => {
  const key = [base];
  return [
    useMutation({
      mutationFn: (id) =>
        updater(toUrl([base, id]), {
          method: "DELETE",
        }),
      onSuccess: () => {
        notifications.show({
          message: "Meal food deleted successfully",
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
