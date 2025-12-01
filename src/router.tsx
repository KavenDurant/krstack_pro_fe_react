import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HostManagement from "./pages/HostManagement";
import FormSettings from "./pages/FormSettings";
import Login from "./pages/Login";
import AuthGuard from "./components/AuthGuard";
import CloudDesktop from "./pages/CloudDesktop";
import ResourceManagement from "./pages/ResourceManagement";
import PlatformManagement from "./pages/PlatformManagement";
import OperationsManagement from "./pages/OperationsManagement";
import UserManagement from "./pages/PlatformManagement/UserManagement";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <AuthGuard>
        <MainLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: "/",
        element: <Navigate to="/hosts" replace />,
      },
      {
        path: "hosts",
        element: <HostManagement />,
      },
      {
        path: "cloud-desktop",
        element: <CloudDesktop />,
      },
      {
        path: "resource-management",
        element: <ResourceManagement />,
      },
      {
        path: "platform-management",
        element: <PlatformManagement />,
      },
      {
        path: "platform-management/users",
        element: <UserManagement />,
      },
      {
        path: "operations-management",
        element: <OperationsManagement />,
      },
      {
        path: "settings/form",
        element: <FormSettings />,
      },
    ],
  },
]);
