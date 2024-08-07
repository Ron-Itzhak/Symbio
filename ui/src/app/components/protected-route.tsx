import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/authContext";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);
  if (!user) {
    return <p>Loading...</p>;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
