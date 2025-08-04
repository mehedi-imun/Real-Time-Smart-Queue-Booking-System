"use client";

interface Props {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: Props) => {
  return <section className="flex">{children}</section>;
};
