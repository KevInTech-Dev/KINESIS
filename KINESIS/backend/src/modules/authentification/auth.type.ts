export const USER_ROLES = [
  "voyageur",
  "compagnie",
  "agent",
  "administrateur",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export interface AuthenticatedUser {
  id: string;
  role: UserRole;
}

export interface AccessTokenResponse {
  accessToken: string;
  tokenType: "Bearer";
  expiresIn: number;
}