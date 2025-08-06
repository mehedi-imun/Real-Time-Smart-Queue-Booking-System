import Navbar from "@/components/shared/navbar/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "queue-booking-system",
  description: "Book your next adventure with queue-booking-system.",
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
      <div className="">{children}</div>
      <footer></footer>
      {/* <Footer /> */}
    </div>
  );
}
