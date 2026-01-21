// routes/health.ts
import express, { Request, Response, Router } from 'express';

interface HealthResponse {
  status: string;
  timestamp: string;
}

const router: Router = express.Router();

router.get('/', (req: Request, res: Response): void => {
  const healthResponse: HealthResponse = { 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  };
  res.json(healthResponse);
});

export default router;