/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export const userInfo = async () => {
  const accessToken = (await cookies()).get("accessToken")?.value;
  let decodedData = null;
  if (accessToken) {
    decodedData = (await jwtDecode(accessToken)) as any;
    return {
      email: decodedData.email,
      role: decodedData.role,
      id: decodedData.id,
    };
  } else {
    return null;
  }
};

export const logout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  return { success: true };
};
