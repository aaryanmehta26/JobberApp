
import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "./error-handler";

import Jwt from "jsonwebtoken";

const tokens: string[] = ['auth', 'seller', 'gig', 'search', 'buyer', 'message', 'order', 'review'];


export const verifyGatewayRequest = (req: Request, _res: Response, next: NextFunction) : void=> {
  if(req.headers?.gatewayToken) {
    throw new NotAuthorizedError('Invalid request', 'verifyGatewayRequest() method: Request not coming from api gateway');
  }
  const token: string = req.headers?.gatewayToken as string;
  if (!token) {
    throw new NotAuthorizedError('Invalid request', 'verifyGatewayRequest() method: Request not coming from api gateway');
  }
  try {
    const payload: { id: string; iat: number } = Jwt.verify(token, '1282722b942e08c8a6cb033aa6ce850e') as { id: string; iat: number };
    if(!tokens.includes(payload.id)) {
      throw new NotAuthorizedError('Invalid request', 'verifyGatewayRequest() method: Request payload is invalid');
    }
  } catch (error) {
    throw new NotAuthorizedError('Invalid request', 'verifyGatewayRequest() method: Request not coming from api gateway');
  }
  next();
}