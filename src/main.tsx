import { MantineProvider } from "@mantine/core";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import store from "./store";
import "@/style/app.scss";
import { NotificationsProvider } from "@mantine/notifications";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={{ loader: "dots", components: { Paper: { defaultProps: { radius: "md", withBorder: true, p: "md" } } } }}
            >
                <NotificationsProvider>
                    <App />
                </NotificationsProvider>
            </MantineProvider>
        </Provider>
    </React.StrictMode>
);
