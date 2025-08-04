import React from "react";
import { AdminLayout } from "./layout/adminLayout";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className=" ">
      <AdminLayout>
        <div>{children}</div>
      </AdminLayout>
    </div>
  );
};

export default DashboardLayout;
