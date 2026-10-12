import { AuthenticationError, ConflictError } from "../../common/errors/app-error.js";
import env from "../../config/env.js";
import { UniqueConstraintError } from "sequelize";
import type { LoginInput, RegisterTravelerInput } from "./auth.schema.js";
import { hashPassword, verifyPassword } from "./password.service.js";
import { AccountRepository } from "./account.repository.js";
import { createAccessToken } from "./token.service.js";
import type { AccessTokenResponse } from "./auth.type.js";

export interface TravelerAccountResponse {
  id: string;
  email: string;
  phoneNumber: string;
  role: "voyageur";
  firstName: string;
  lastName: string;
}

export class AuthService {
  constructor(private readonly accountRepository = new AccountRepository()) {}

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

  async login(input: LoginInput): Promise<AccessTokenResponse> {
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

    return {
      accessToken: createAccessToken({
        id: account.id,
        role: account.role,
      }),
      tokenType: "Bearer",
      expiresIn: env.JWT_ACCESS_TOKEN_TTL_SECONDS,
    };
  }
}