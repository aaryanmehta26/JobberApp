import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { BadRequestError, IAuthPayload, NotAuthorizedError } from '../../../jobber-shared/src';
import { config } from '../config';

class AuthMiddleware {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public verifyUser(req: Request, res: Response, next: NextFunction): void {
    if (!req.session?.jwt) {
      throw new NotAuthorizedError('Token is not available. Please login again', 'Gatewayservice verifyUser() method');
    }

    try {
      const payload: IAuthPayload = verify(req.session?.jwt, `${config.JWT_TOKEN}`) as IAuthPayload;
      req.currentUser = payload;
    } catch (error) {
      throw new NotAuthorizedError(
        'Token is not available. Please login again',
        'Gatewayservice verifyUser() invalid session method error'
      );
    }
    next();
  }

  public checkAuthentication(req: Request, _res: Response, next: NextFunction) {
    if (!req.currentUser) {
      throw new BadRequestError('Authentication is required to access this route', 'Gateway service checkAuthentication() method error');
    }
    next();
  }
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware();
