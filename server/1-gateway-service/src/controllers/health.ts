
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export class Health {
  public health(_req: Request, res: Response): void {
    console.log('%%%');
    res.status(StatusCodes.OK).send('API Gateway service is healthy and OK.');
  }
}