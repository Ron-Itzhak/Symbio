"use client";

import React from "react";
import { usePathname } from "next/navigation";
import ProtectedRoute from "./protected-route";

const noAuthRequired = ["/login", "/register"];

const ClientWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isPublicPage = noAuthRequired.includes(pathname);

  return (
    <>{isPublicPage ? children : <ProtectedRoute>{children}</ProtectedRoute>}</>
  );
};

export default ClientWrapper;
