import { createTheme } from "@mantine/core";

export const theme = createTheme({
  components: {
    Paper: { defaultProps: { radius: "lg", withBorder: true, p: { sm: "md", base: "sm" } } },
    Button: { defaultProps: { radius: "md" } },
    Modal: {
      defaultProps: {
        styles: {
          root: {
            "& .mantinePaperRoot": { padding: 0 },
          },
        },
        padding: 16,
      },
    },
  },
});
