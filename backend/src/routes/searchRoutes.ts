import { Router } from 'express';
import searchController from '../controllers/searchController';

const router = Router();

// Public search endpoint
router.get('/', searchController.search.bind(searchController));

export default router;
