export const darkLight = (mode: "dark" | "light" | "auto", dark: string, light: string) => {
  return mode === "dark" ? dark : light;
};
