import { api } from "./api.ts";
import type {
  AuthenticationResponse,
  CreateUserResponse,
} from "../schemas/user.ts";

export const authService = {
  /**
   * Authenticate user and receive JWT token
   */
  async login(
    username: string,
    password: string,
  ): Promise<AuthenticationResponse> {
    const response = await api.post<AuthenticationResponse>("/auth/login", {
      username,
      password,
    });
    return response.data;
  },

  /**
   * Register a new user account
   */
  async register(
    username: string,
    password: string,
  ): Promise<CreateUserResponse> {
    const response = await api.post<CreateUserResponse>("/auth/register", {
      username,
      password,
    });
    return response.data;
  },
};
