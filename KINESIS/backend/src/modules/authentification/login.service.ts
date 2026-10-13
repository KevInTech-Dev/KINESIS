import { randomBytes, createHash } from "node:crypto";
import {
  AuthenticationError,
  ConflictError,
  UnauthorizedError,
} from "../../common/errors/app-error";
import env from "../../config/env";
import { UniqueConstraintError } from "sequelize";
import type { LoginInput, RegisterTravelerInput } from "./auth.schema";
import { hashPassword, verifyPassword } from "./password.service";
import { AccountRepository } from "./account.repository";
import { createAccessToken } from "./token.service";
import { RefreshTokenRepository } from "./refreshToken.repository";
import type { AccessTokenResponse, AuthenticatedUser } from "./auth.type";

export interface AuthSessionResponse extends AccessTokenResponse {
  refreshToken: string;
}

export interface TravelerAccountResponse {
  id: string;
  email: string;
  phoneNumber: string;
  role: "voyageur";
  firstName: string;
  lastName: string;
}

export class AuthService {
  constructor(
    private readonly accountRepository = new AccountRepository(),
    private readonly refreshTokenRepository = new RefreshTokenRepository(),
  ) {}

  private async createSession(
    user: AuthenticatedUser,
  ): Promise<AuthSessionResponse> {
    const refreshToken = randomBytes(32).toString("base64url");
    const tokenHash = createHash("sha256").update(refreshToken).digest("hex");
    const expiresAt = new Date(
      Date.now() + env.REFRESH_TOKEN_EXPIRY_TIME * 1000,
    );

    await this.refreshTokenRepository.create(user.id, tokenHash, expiresAt);

    return {
      accessToken: createAccessToken(user),
      refreshToken,
      tokenType: "Bearer",
      expiresIn: env.ACCESS_TOKEN_EXPIRY_TIME,
    };
  }

  async registerTraveler(
    input: RegisterTravelerInput,
  ): Promise<TravelerAccountResponse> {
    const passwordHash = await hashPassword(input.password);

    try {
      const { account, profile } =
        await this.accountRepository.createTraveler(input, passwordHash);

      return {
        id: account.id,
        email: account.email,
        phoneNumber: account.phoneNumber,
        role: "voyageur",
        firstName: profile.firstName,
        lastName: profile.lastName,
      };
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new ConflictError("Cet email ou ce numéro est déjà utilisé");
      }
      throw error;
    }
  }

  async login(input: LoginInput): Promise<AuthSessionResponse> {
    const account = await this.accountRepository.findByIdentifier(
      input.identifier,
    );

    if (
      !account ||
      !account.isActive ||
      !(await verifyPassword(input.password, account.passwordHash))
    ) {
      throw new AuthenticationError("Identifiant ou mot de passe invalide");
    }

    return this.createSession({ id: account.id, role: account.role });
  }

  async refresh(refreshToken: string): Promise<AuthSessionResponse> {
    const tokenHash = createHash("sha256").update(refreshToken).digest("hex");
    const replacementToken = randomBytes(32).toString("base64url");
    const replacementHash = createHash("sha256")
      .update(replacementToken)
      .digest("hex");
    const expiresAt = new Date(
      Date.now() + env.REFRESH_TOKEN_EXPIRY_TIME * 1000,
    );
    const account = await this.refreshTokenRepository.rotate(
      tokenHash,
      replacementHash,
      expiresAt,
    );

    if (!account) {
      throw new UnauthorizedError("Jeton de renouvellement invalide ou expiré");
    }

    return {
      accessToken: createAccessToken({ id: account.id, role: account.role }),
      refreshToken: replacementToken,
      tokenType: "Bearer",
      expiresIn: env.ACCESS_TOKEN_EXPIRY_TIME,
    };
  }

  async logout(refreshToken: string | undefined): Promise<void> {
    if (!refreshToken) return;

    const tokenHash = createHash("sha256").update(refreshToken).digest("hex");
    await this.refreshTokenRepository.revoke(tokenHash);
  }
}