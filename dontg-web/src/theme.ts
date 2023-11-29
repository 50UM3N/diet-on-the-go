import { createTheme } from "@mantine/core";

export const theme = createTheme({
  components: {
    Button: { defaultProps: { radius: "md" } },
    TextInput: {
      defaultProps: {
        radius: "md",
        size: "sm",
      },
    },
    Modal: {
      defaultProps: {
        radius: "md",
      },
    },
    Menu: {
      defaultProps: {
        radius: "lg",
      },
    },
  },
});
