import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/auth-context";
import SpinnerIcon from "./spinner-icon";

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
    return (
      <div className="pt-10 flex items-center justify-center">
        <SpinnerIcon className="mr-2 h-40 w-40 animate-spin" />
      </div>
    );
  }
  return <>{children}</>;
};

export default ProtectedRoute;
