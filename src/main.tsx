import { MantineProvider } from "@mantine/core";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import store from "./store";
import "@/style/app.scss";

import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={{
                    loader: "dots",
                    components: {
                        Paper: { defaultProps: { radius: "lg", withBorder: true, p: { sm: "md", base: "sm" } } },
                        Button: { defaultProps: { radius: "md" } },
                        Modal: {
                            defaultProps: {
                                styles: {
                                    root: {
                                        "& .mantine-Paper-root": { padding: 0 },
                                    },
                                },
                                padding: 16,
                            },
                        },
                    },
                }}
            >
                <ModalsProvider>
                    <Notifications />
                    <App />
                </ModalsProvider>
            </MantineProvider>
        </Provider>
    </React.StrictMode>
);
