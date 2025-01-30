export interface IUser {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  wishlist: string[];
  password?: string;
  resetPasswordToken?: string;
  resetPasswordTokenExpires?: string;
  createdAt: string;
  updatedAt: string;
  role: UserRole;
}

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  GUEST = "guest",
  HOST = "host",
}
