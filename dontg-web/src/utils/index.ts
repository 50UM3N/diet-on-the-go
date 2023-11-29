import { ACTIVITY_LEVEL } from "@/data/constant";
import { Gender } from "@/types/index.type";
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
type CalculateBMR = (params: { age: number; height: { inches: number; feet: number }; weight: number; gender: Gender }) => number;
type CalculateAMR = (params: { bmr: number; activityLevel: keyof typeof ACTIVITY_LEVEL }) => number;

export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({
    itemRank,
  });
  return itemRank.passed;
};

export const calculateBMR: CalculateBMR = (params) => {
  let bmr = 0;
  const heightInCm = (params.height.feet * 12 + params.height.inches) * 2.54;
  if (params.gender === "male") {
    // bmr = 66.47 + 13.75 * params.weight + (5.003 + heightInCm) - 6.755 * params.age;
    bmr = 10 * params.weight + 6.25 * heightInCm - 5 * params.age + 5;
  } else {
    // bmr = 655.1 + 9.563 * params.weight + (1.85 + heightInCm) - 4.676 * params.age;
    bmr = 10 * params.weight + 6.25 * heightInCm - 5 * params.age - 161;
  }
  return bmr;
};

export const calculateAMR: CalculateAMR = ({ bmr, activityLevel }) => {
  return bmr * ACTIVITY_LEVEL[activityLevel].value;
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
