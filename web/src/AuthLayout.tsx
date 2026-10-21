import { Outlet } from "react-router-dom";
import { AuthProvider } from "./context/authContext";

export default function AuthLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  )
}