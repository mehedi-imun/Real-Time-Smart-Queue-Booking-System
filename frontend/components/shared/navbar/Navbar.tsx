"use client";
import { logout } from "@/app/(withComonLayout)/actions/auth";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthProviders";
import Link from "next/link";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";

const Navbar = () => {
  const { user } = useAuth();
  const handleLogOut = async () => {
    await logout();
    window.location.reload();
  };
  return (
    <div className="">
      <nav className="fixed top-6 inset-x-4 h-16 bg-background border dark:border-slate-700/70 max-w-screen-xl mx-auto rounded-full">
        <div className="h-full flex items-center justify-between mx-auto px-4">
          <Link href="/">
            <Logo />
          </Link>

          {/* Desktop Menu */}
          <NavMenu className="hidden md:block" />

          <div className="flex items-center gap-3">
            {user ? (
              <Button onClick={handleLogOut} className="rounded-full">
                Logout
              </Button>
            ) : (
              <Button className="rounded-full">
                <Link href="/login">Login</Link>
              </Button>
            )}

            {/* Mobile Menu */}
            <div className="md:hidden">
              <NavigationSheet />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
