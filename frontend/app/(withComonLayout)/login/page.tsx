
"use client";

import { Button } from "@/components/ui/button";

export default function GoogleLoginButton() {
  return (
    <a
      href="http://localhost:5000/api/v1/auth/google"
      className="w-full"
      onClick={(e) => e.stopPropagation()}
    >
      <Button type="button" variant="outline" className="w-full cursor-pointer">
        Login with Google
      </Button>
    </a>
  );
}
