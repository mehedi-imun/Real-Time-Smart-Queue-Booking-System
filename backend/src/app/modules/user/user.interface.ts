export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  TESTER = "TESTER",
}

export interface IAuthProvider {
  provider: "google" | "credentials"; // "Google", "Credential"
  providerId: string;
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IUser {
  _id?: string;
  picture?: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  isDeleted?: boolean;
  isActive?: IsActive;
  isVerified?: boolean;
  auths: IAuthProvider[];
  lastLoginAt?: Date;
  passwordResetToken?: {
    token: string;
    expiresAt: Date;
  };
}
