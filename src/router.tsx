/*
 * @Author: KavenDurant luojiaxin888@gmail.com
 * @Date: 2025-12-03 13:41:23
 * @LastEditors: KavenDurant luojiaxin888@gmail.com
 * @LastEditTime: 2025-12-03 13:58:17
 * @FilePath: /krstack_pro_fe_react/src/router.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HostManagement from "./pages/HostManagement";
import FormSettings from "./pages/FormSettings";
import Login from "./pages/Login";
import AuthGuard from "./components/AuthGuard";
import CloudDesktop from "./pages/CloudDesktop";
import ResourceManagement from "./pages/ResourceManagement";
import OperationsManagement from "./pages/OperationsManagement";
import UserManagement from "./pages/PlatformManagement/UserManagement";
import LicenseManagement from "./pages/PlatformManagement/LicenseManagement";
import DataManagement from "./pages/PlatformManagement/DataManagement";
import SecurityManagement from "./pages/PlatformManagement/SecurityManagement";
import LabManagement from "./pages/PlatformManagement/LabManagement";
import AppearanceManagement from "./pages/PlatformManagement/AppearanceManagement";

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
        element: <Navigate to="/platform-management/users" replace />,
      },
      {
        path: "platform-management/users",
        element: <UserManagement />,
      },
      {
        path: "platform-management/license",
        element: <LicenseManagement />,
      },
      {
        path: "platform-management/data",
        element: <DataManagement />,
      },
      {
        path: "platform-management/security",
        element: <SecurityManagement />,
      },
      {
        path: "platform-management/lab",
        element: <LabManagement />,
      },
      {
        path: "platform-management/appearance",
        element: <AppearanceManagement />,
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
