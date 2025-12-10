import { Router } from 'express';
import favoriteController from '../controllers/favoriteController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// All favorite routes require authentication
router.use(authMiddleware);

router.get('/', favoriteController.getUserFavorites.bind(favoriteController));
router.post('/', favoriteController.addFavorite.bind(favoriteController));
router.delete('/:propertyId', favoriteController.removeFavorite.bind(favoriteController));
router.get('/check/:propertyId', favoriteController.checkFavorite.bind(favoriteController));

export default router;
