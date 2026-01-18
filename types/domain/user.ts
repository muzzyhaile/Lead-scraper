/**
 * User Domain Types
 * Types related to users and authentication
 */

export interface User {
  name: string;
  email: string;
  avatar: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}
