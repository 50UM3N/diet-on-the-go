import { EntryBase } from "@/data/constant";
import { AppError, ChartInfo, CreateChartDTO, UpdateChartDTO } from "@/types/index.type";
import { toUrl } from "@/utils";
import { fetcher, updater } from "@/utils/fetch";
import { notifications } from "@mantine/notifications";
import { UseMutationResult, UseQueryResult, useMutation, useQuery } from "react-query";

const base = EntryBase.CHART;

export const useGetChart = (): [UseQueryResult<ChartInfo[], AppError>, string[]] => {
  const key = [base];
  return [useQuery(key, () => fetcher(toUrl(key))), key];
};

export const useGetChartById = (id: string): [UseQueryResult<ChartInfo, AppError>, string[]] => {
  const key = [base, "by-id", id];
  return [useQuery(key, () => fetcher(toUrl(key))), key];
};

export const useCreateChart = (): [UseMutationResult<ChartInfo, AppError, CreateChartDTO, unknown>, string[]] => {
  const key = [base];
  return [
    useMutation(
      (data) =>
        updater(toUrl([base]), {
          method: "POST",
          body: data,
        }),
      {
        onSuccess: () => {
          notifications.show({
            message: "Chart created successfully",
          });
        },
        onError(error) {
          notifications.show({
            color: "red",
            message: error.message,
          });
        },
      }
    ),
    key,
  ];
};

export const useUpdateChart = (): [
  UseMutationResult<
    ChartInfo,
    AppError,
    {
      id: string;
      data: UpdateChartDTO;
    },
    unknown
  >,
  string[]
] => {
  const key = [base];
  return [
    useMutation(
      (param) =>
        updater(toUrl([base, param.id]), {
          method: "PATCH",
          body: param.data,
        }),
      {
        onSuccess: () => {
          notifications.show({
            message: "Chart updated successfully",
          });
        },
        onError(error) {
          notifications.show({
            color: "red",
            message: error.message,
          });
        },
      }
    ),
    key,
  ];
};

export const useDeleteChart = (): [UseMutationResult<ChartInfo, AppError, string, unknown>, string[]] => {
  const key = [base];
  return [
    useMutation(
      (id) =>
        updater(toUrl([base, id]), {
          method: "DELETE",
        }),
      {
        onSuccess: () => {
          notifications.show({
            message: "Chart deleted successfully",
          });
        },
        onError(error) {
          notifications.show({
            color: "red",
            message: error.message,
          });
        },
      }
    ),
    key,
  ];
};
