import { createTheme } from "@mantine/core";

export const theme = createTheme({
  primaryColor: "cyan",
  components: {
    Button: { defaultProps: { radius: "md" } },
    TextInput: {
      defaultProps: {
        radius: "md",
      },
    },
    Textarea: {
      defaultProps: {
        radius: "md",
      },
    },
    NumberInput: {
      defaultProps: {
        radius: "md",
      },
    },
    Select: {
      defaultProps: {
        radius: "md",
        comboboxProps: {
          radius: "md",
        },
      },
    },
    Modal: {
      defaultProps: {
        radius: "lg",
      },
    },
    Menu: {
      defaultProps: {
        radius: "lg",
      },
    },
    Loader: {
      defaultProps: {
        type: "dots",
      },
    },
  },
});
