import { z } from "zod";

// API Request Schemas
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username must be at most 50 characters"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(50, "Password must be at most 50 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// API Response Types
export interface AuthenticationResponse {
  username: string;
  token: string;
}

export interface CreateUserResponse {
  id: string;
  username: string;
  createdAt: string; // ISO 8601 datetime
}

export interface ErrorMessageResponse {
  code: string;
  description: string;
}

// TypeScript types for forms
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
