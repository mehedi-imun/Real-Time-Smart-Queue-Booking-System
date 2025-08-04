"use client";
import { usePathname } from "next/navigation";
import React from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "./AuthProviders";
// import { AuthProvider } from "./AuthProviders";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const location = usePathname();

  //   useEffect(() => {
  //     refreshTokenGen();
  //   }, [location]);
  return (
    <React.Fragment>
      <Toaster />
      <AuthProvider> {children}</AuthProvider>
    </React.Fragment>
  );
};

export default Providers;
