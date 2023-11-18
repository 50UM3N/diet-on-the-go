import { createTheme } from "@mantine/core";
import { DEFAULT_THEME } from "@mantine/core";

export const appTheme = createTheme({
  components: {
    Paper: { defaultProps: { radius: "lg", withBorder: true, p: { sm: "md", base: "sm" } }, styles: { root: { overflow: "hidden" } } },
    Button: { defaultProps: { radius: "md" } },
    Modal: {
      defaultProps: {
        padding: 0,
      },
    },
  },
});

export const theme = DEFAULT_THEME;
