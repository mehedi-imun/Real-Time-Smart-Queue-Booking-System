/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

type Role = keyof typeof roleBasedPrivateRoutes;

const AuthRoutes = ["/login", "/register"];

const roleBasedPrivateRoutes = {
  user: [/^\/dashboard$/, "booking", /^\/events\/[^\/]+\/book$/],
  admin: [/^\/dashboard\/admin/],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = (await cookies()).get("accessToken")?.value;

  // If not authenticated
  if (!accessToken) {
    if (AuthRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Decode JWT
  let decodedData = null;
  try {
    decodedData = jwtDecode(accessToken) as any;
  } catch (err) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const role = decodedData?.role?.toLowerCase() as Role | undefined;

  if (role && roleBasedPrivateRoutes[role]) {
    const routes = roleBasedPrivateRoutes[role];
    if (routes.some((route) => pathname.match(route))) {
      return NextResponse.next();
    }
  }

  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/login", "/register", "/dashboard/:page*", "/events/:id/book"],
};
