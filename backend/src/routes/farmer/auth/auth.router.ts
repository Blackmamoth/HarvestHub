import { Router } from "express";
import { loginFarmer, registerFarmer, refreshToken } from '../../../controllers/farmer/auth/auth.controller';

const router = Router();

router.post('/register', registerFarmer);
router.post('/login', loginFarmer);
router.post('/refresh', refreshToken)

export default router;