import { createTheme } from "@mantine/core";

export const theme = createTheme({
  primaryColor: "cyan",
  components: {
    Button: { defaultProps: { radius: "md" } },
    TextInput: {
      defaultProps: {
        radius: "md",
      },
      styles: {
        input: {
          borderWidth: 2,
        },
      },
    },
    Textarea: {
      defaultProps: {
        radius: "md",
        styles: {
          input: {
            borderWidth: 2,
          },
        },
      },
    },
    PasswordInput: {
      defaultProps: {
        radius: "md",
        styles: {
          input: {
            borderWidth: 2,
          },
        },
      },
    },
    NumberInput: {
      defaultProps: {
        radius: "md",
        styles: {
          input: {
            borderWidth: 2,
          },
        },
      },
    },
    Select: {
      defaultProps: {
        radius: "md",
        comboboxProps: {
          radius: "md",
        },
        styles: {
          input: {
            borderWidth: 2,
          },
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
