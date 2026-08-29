import { Router } from 'express';
import contactRoutes from './contactRoutes';

const router = Router();

router.use('/contact', contactRoutes);

export default router;
