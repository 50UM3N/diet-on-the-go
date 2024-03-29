import { Gender } from "@/types/index.type";
import { notifications } from "@mantine/notifications";
import { rankItem } from "@tanstack/match-sorter-utils";
import { FilterFn } from "@tanstack/table-core";

export function toUrl(data: string[]) {
  return "/" + data.join("/");
}
export const darkLight = (mode: "dark" | "light" | "auto", dark: string, light: string) => {
  return mode === "dark" ? dark : light;
};

const MACRO_UNITS = {
  protein: 4,
  fat: 9,
  carbohydrates: 4,
};
type CalculateBMR = (params: { age: number; height: number; weight: number; gender: Gender }) => number;
type CalculateAMR = (params: { bmr: number; activityLevel: number }) => number;

export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({
    itemRank,
  });
  return itemRank.passed;
};

export const calculateBMR: CalculateBMR = (params) => {
  let bmr = 0;
  if (params.gender === "male") {
    // bmr = 66.47 + 13.75 * params.weight + (5.003 + params.height) - 6.755 * params.age;
    bmr = 10 * params.weight + 6.25 * params.height - 5 * params.age + 5;
  } else {
    // bmr = 655.1 + 9.563 * params.weight + (1.85 + params.height) - 4.676 * params.age;
    bmr = 10 * params.weight + 6.25 * params.height - 5 * params.age - 161;
  }
  return bmr;
};

export const calculateAMR: CalculateAMR = ({ bmr, activityLevel }) => {
  return bmr * activityLevel;
};

export const calToGm = (cal: number, type: keyof typeof MACRO_UNITS) => {
  return (cal / MACRO_UNITS[type]).toFixed(1);
};
type CalcPercentage = (val: number, percentage: number) => number;
export const calcPercentage: CalcPercentage = (val, percentage) => {
  return Number(((val * percentage) / 100).toFixed(1));
};

type CalcByGm = (unit: number, toBeCalc: number) => number;
export const calcByGm: CalcByGm = (unit, toBeCalc) => {
  return Number(((unit * toBeCalc) / 100).toFixed(1));
};

type CalcByPC = (unit: number, toBeCalc: number) => number;
export const calcByPC: CalcByPC = (unit, toBeCalc) => {
  return Number((unit * toBeCalc).toFixed(1));
};
type CalcAmount = (unit: number, toBeCalc: number, metric: any) => number;
export const calcAmount: CalcAmount = (unit, toBeCalc, metric) => {
  if (metric === "PER_100_G") return calcByGm(unit, toBeCalc);
  else return calcByPC(unit, toBeCalc);
};

export const inchFeetToCm = (inch: number, feet: number) => {
  return feet * 30.48 + inch * 2.54;
};

export const cmToInchFeet = (cm: number) => {
  return {
    feet: Math.floor((cm % 30.48) / 2.54),
    inch: Math.floor(cm / 30.48),
  };
};

export const downloadFile = async (url: string, filename?: string) => {
  const id = notifications.show({
    message: "Start file downloading",
  });
  const token = localStorage.getItem("token");
  const res = await fetch(import.meta.env.APP_BASE_API + url, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (res.ok === true) {
    const file = await res.blob();
    const urlObj = window.URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = urlObj;
    link.setAttribute("download", filename || "export");
    document.body.append(link);
    link.click();
    link.remove();
    notifications.update({
      id,
      message: "File Download successfully",
    });
  } else {
    notifications.update({
      id,
      color: "red",
      message: "File Download failed",
    });
  }
};
