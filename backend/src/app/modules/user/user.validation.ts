import z from "zod";
import { IsActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z.string({ invalid_type_error: "Name must be string" }),
  email: z
    .string({ invalid_type_error: "Email must be string" })
    .email({ message: "Invalid email address format." }),
  password: z.string({ invalid_type_error: "Password must be string" }),
});
export const updateUserZodSchema = z.object({
  name: z.string({ invalid_type_error: "Name must be string" }).optional(),
  email: z
    .string({ invalid_type_error: "Email must be string" })
    .email({ message: "Invalid email address format." })
    .optional(),
  password: z
    .string({ invalid_type_error: "Password must be string" })
    .optional(),
  picture: z
    .string({ invalid_type_error: "Picture must be string" })
    .url("Picture must be a valid URL")
    .optional(),
  role: z
    .enum([Role.SUPER_ADMIN, Role.ADMIN, Role.USER, Role.TESTER])
    .optional(),
  isActive: z
    .enum([IsActive.ACTIVE, IsActive.INACTIVE, IsActive.BLOCKED])
    .optional(),
});
