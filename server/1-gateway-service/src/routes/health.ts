
import express, { Router } from 'express';

import { Health } from '../controllers/health';

class HealthRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    console.log('$$$$');

    this.router.get('gateway-health', Health.prototype.health);
    return this.router;
  }

}

export const healthRoutes: HealthRoutes = new HealthRoutes();