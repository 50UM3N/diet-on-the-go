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
        input: {},
      },
    },
    Textarea: {
      defaultProps: {
        radius: "md",
        styles: {
          input: {},
        },
      },
    },
    PasswordInput: {
      defaultProps: {
        radius: "md",
        styles: {
          input: {},
        },
      },
    },
    NumberInput: {
      defaultProps: {
        radius: "md",
        styles: {
          input: {},
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
          input: {},
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
    Container: {
      defaultProps: {
        p: 0,
      },
    },
  },
});
