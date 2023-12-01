import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./layouts/Root";
import Index from "./pages/Index";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import Dash from "./pages/dash/Dash";
import { AuthProvider, NonAuthProvider } from "./provider/AuthProvider";
import { DashLayout } from "./layouts/DashLayout";
import FoodItems from "./pages/dash/FoodItems";
import DietChart from "./pages/dash/DietChart/DietChart";
import UpdateDietChart from "./pages/dash/DietChart/UpdateDietChart";

const router = createBrowserRouter([
  {
    element: <Root />,
    errorElement: <p>error</p>,
    children: [
      {
        element: <NonAuthProvider />,
        children: [
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
      {
        element: <AuthProvider />,
        children: [
          {
            element: <DashLayout />,
            children: [
              {
                path: "/",
                element: <>asdasd</>,
              },
              {
                path: "/food-items",
                element: <FoodItems />,
              },
              {
                path: "/diet-chart",
                element: <DietChart />,
              },
              {
                path: "/diet-chart/:id",
                element: <UpdateDietChart />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
