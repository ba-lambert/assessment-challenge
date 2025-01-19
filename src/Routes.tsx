import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./layouts/App";
import SignIn from "./app/Auth/Signin";
import SignUp from "./app/Auth/Signup";
import ResetPassword from "./app/Auth/ResetPassword";
import Accounts from "./app/Main/Accounts";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Dashboard from "./app/Main/Dashboard";
import AuthLayout from "./layouts/Auth";
import Transactions from "./app/Main/Transactions";
import Categories from "./app/Main/Categories";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "accounts",
        element: <Accounts />,
      },
      {
        path: "categories",
        element: <Categories />,
      },
      {
        path: "transactions",
        element: <Transactions />
      },
    ],
  },
  {
    path: "/auth",
    element:<AuthLayout />,
    children: [
      {
        path: "signin",
        element: <SignIn />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
    ],
  },
]);

export function Routes() {
  return <RouterProvider router={router} />;
}
