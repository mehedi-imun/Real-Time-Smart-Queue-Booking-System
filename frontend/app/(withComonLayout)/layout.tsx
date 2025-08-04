import Navbar from "@/components/shared/navbar/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apollo Gears",
  description: "Book your next adventure with Apollo Gears.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //   const user = await userInfo();
  return (
    <div>
      <Navbar></Navbar>
      <div className="mx-auto container">{children}</div>
      footer
      {/* <Footer /> */}
    </div>
  );
}
