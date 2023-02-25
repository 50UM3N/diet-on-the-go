import { MantineProvider } from "@mantine/core";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import store from "./store";
import "@/style/app.scss";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <MantineProvider withGlobalStyles withNormalizeCSS theme={{loader:"dots"}}>
                <App />
            </MantineProvider>
        </Provider>
    </React.StrictMode>
);
