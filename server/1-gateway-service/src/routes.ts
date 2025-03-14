import { Application } from 'express';

import { healthRoutes } from './routes/health';


export const appRoutes = (app: Application) => {
  console.log('### 1');
  console.log('Routes:', healthRoutes.routes());
  app.use('', healthRoutes.routes());
};