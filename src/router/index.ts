import express from 'express'
import { RouteConstants } from '../constants/route.constants';
import playerRoutes from './players.route';
import leaderboardRoutes from './leaderboard.route';

const router = express.Router();

// Player routes
router.use(RouteConstants.PLAYERS.BASE, playerRoutes);

// Leaderboard routes
router.use(RouteConstants.LEADERBOARD.BASE, leaderboardRoutes);

export default router;