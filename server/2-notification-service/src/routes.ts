import express, {Request, Response, Router} from 'express';
import { StatusCodes } from 'http-status-codes';

const router: Router = express.Router();

export function healthRoutes(): Router {
  router.get('/notification-health', (req: Request, res: Response) => {
    res.status(StatusCodes.OK).send('Notification service is health and Ok');
  });
  return router;
}