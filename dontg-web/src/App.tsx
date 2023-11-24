import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./layouts/Root";
import Index from "./pages/Index";
import { Login } from "./pages/auth/Login";
import { Button, useMantineColorScheme } from "@mantine/core";
import { Register } from "./pages/auth/Register";

const router = createBrowserRouter([
  {
    element: <Root />,
    errorElement: <p>error</p>,
    children: [
      {
        path: "/",
        element: <Index />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
]);

function App() {
  const { setColorScheme, colorScheme } = useMantineColorScheme();
  return (
    <>
      <RouterProvider router={router} />
      <Button
        style={{ position: "fixed", bottom: 20, right: 20 }}
        onClick={() => setColorScheme(colorScheme === "dark" ? "light" : "dark")}
      >
        {colorScheme}
      </Button>
    </>
  );
}

export default App;
