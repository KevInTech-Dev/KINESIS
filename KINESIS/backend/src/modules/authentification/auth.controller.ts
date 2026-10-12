import type { Request, Response } from "express";
import { sendCreated, sendError, sendSuccess } from "../../common/api.response.js";
import env from "../../config/env.js";
import type {
  LoginInput,
  RegisterTravelerInput,
} from "./auth.schema.js";
import { AuthService } from "./login.service.js";

export class AuthController {
  constructor(private readonly authService = new AuthService()) {}

  private setRefreshCookie(res: Response, token: string): void {
    res.cookie("kinesis_refresh_token", token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      path: `${env.API_PREFIX}/auth`,
      maxAge: env.REFRESH_TOKEN_EXPIRY_TIME * 1000,
    });
  }

  private clearRefreshCookie(res: Response): void {
    res.clearCookie("kinesis_refresh_token", {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      path: `${env.API_PREFIX}/auth`,
    });
  }

  registerTraveler = async (req: Request, res: Response): Promise<Response> => {
    const account = await this.authService.registerTraveler(
      req.body as RegisterTravelerInput,
    );
    return sendCreated(res, account, "Compte voyageur créé");
  };

  login = async (req: Request, res: Response): Promise<Response> => {
    const session = await this.authService.login(req.body as LoginInput);
    this.setRefreshCookie(res, session.refreshToken);
    const { refreshToken: _refreshToken, ...response } = session;
    return sendSuccess(res, response, "Connexion réussie");
  };

  refresh = async (req: Request, res: Response): Promise<Response> => {
    const refreshToken: unknown = req.cookies?.kinesis_refresh_token;

    if (typeof refreshToken !== "string" || refreshToken.length === 0) {
      this.clearRefreshCookie(res);
      return sendError(
        res,
        "UNAUTHORIZED",
        "Jeton de renouvellement requis",
        401,
      );
    }

    const session = await this.authService.refresh(refreshToken);
    this.setRefreshCookie(res, session.refreshToken);
    const { refreshToken: _newRefreshToken, ...response } = session;
    return sendSuccess(res, response, "Session renouvelée");
  };

  logout = async (req: Request, res: Response): Promise<Response> => {
    const refreshToken: unknown = req.cookies?.kinesis_refresh_token;
    await this.authService.logout(
      typeof refreshToken === "string" ? refreshToken : undefined,
    );
    this.clearRefreshCookie(res);
    return sendSuccess(res, null, "Déconnexion réussie");
  };
}