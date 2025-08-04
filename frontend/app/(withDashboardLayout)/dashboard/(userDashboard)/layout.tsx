import React from "react";
import { UserLayout } from "./layout/userLayout";
// import { Layout } from "./components/layout/layout";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className=" ">
      <UserLayout>
        <div>{children}</div>
      </UserLayout>
    </div>
  );
};

export default DashboardLayout;
