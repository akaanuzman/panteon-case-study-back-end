import express from 'express'
import { RouteConstants } from '../constants/route.constants';
import leaderboardRoutes from './leaderboard.route';
import { SeederController } from '../controllers/seeder.controller';

const router = express.Router();

// Leaderboard routes
router.use(RouteConstants.LEADERBOARD.BASE, leaderboardRoutes);

// Seeder route
router.post(RouteConstants.SEED_PLAYERS, SeederController.seedPlayers);

export default router;