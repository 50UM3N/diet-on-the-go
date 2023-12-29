import { EntryBase } from "@/data/constant";
import { queryClient } from "@/main";
import { AppError, ChartInfo, CreateChartDTO, CreateCopyChartDTO, UpdateChartDTO } from "@/types/index.type";
import { toUrl } from "@/utils";
import { fetcher, updater } from "@/utils/fetch";
import { notifications } from "@mantine/notifications";
import { useQuery, useMutation, UseQueryResult, UseMutationResult } from "@tanstack/react-query";
const base = EntryBase.CHART;

// Endpoint: [GET] /chart
export const useGetChart = (): [UseQueryResult<ChartInfo[], AppError>, string[]] => {
  const key = [base];
  return [useQuery({ queryKey: key, queryFn: () => fetcher(toUrl(key)) }), key];
};

// Endpoint: [GET] /chart/by-id/:id
export const useGetChartById = (id: string): [UseQueryResult<ChartInfo, AppError>, string[]] => {
  const key = [base, "by-id", id];
  return [useQuery({ queryKey: key, queryFn: () => fetcher(toUrl(key)) }), key];
};

// Endpoint: [POST] /chart
export const useCreateChart = (): [UseMutationResult<ChartInfo, AppError, CreateChartDTO>, string[]] => {
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
          message: "Chart created successfully",
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

// Endpoint: [POST] /chart/copy
export const useCreateCopyChart = (): [UseMutationResult<ChartInfo, AppError, CreateCopyChartDTO>, string[]] => {
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
          message: "Copying chart...",
        });
      },
      onSuccess: () => {
        notifications.show({
          message: "Chart copied successfully",
        });
        queryClient.invalidateQueries();
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

// Endpoint: [PATCH] /chart/:id
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
    useMutation({
      mutationFn: (param) =>
        updater(toUrl([base, param.id]), {
          method: "PATCH",
          body: param.data,
        }),
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
    }),
    key,
  ];
};

// Endpoint: [DELETE] /chart/:id
export const useDeleteChart = (): [UseMutationResult<ChartInfo, AppError, string>, string[]] => {
  const key = [base];
  return [
    useMutation({
      mutationFn: (id) =>
        updater(toUrl([base, id]), {
          method: "DELETE",
        }),
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
    }),
    key,
  ];
};
