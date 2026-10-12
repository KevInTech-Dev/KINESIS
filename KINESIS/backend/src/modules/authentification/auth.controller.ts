import type { Request, Response } from "express";
import { sendCreated, sendSuccess } from "../../common/api.response.js";
import type {
  LoginInput,
  RegisterTravelerInput,
} from "./auth.schema.js";
import { AuthService } from "./login.service.js";

export class AuthController {
  constructor(private readonly authService = new AuthService()) {}

  registerTraveler = async (req: Request, res: Response): Promise<Response> => {
    const account = await this.authService.registerTraveler(
      req.body as RegisterTravelerInput,
    );
    return sendCreated(res, account, "Compte voyageur créé");
  };

  login = async (req: Request, res: Response): Promise<Response> => {
    const token = await this.authService.login(req.body as LoginInput);
    return sendSuccess(res, token, "Connexion réussie");
  };
}