import express from 'express';
import { RouteConstants } from '../constants/route.constants';
import { LeaderboardController } from '../controllers/leaderboard.controller';

const router = express.Router();

router.get(
    RouteConstants.LEADERBOARD.TOP,
    async (req, res) => {
        await LeaderboardController.getTopPlayers(req, res);
    }
);

router.get(
    RouteConstants.LEADERBOARD.SEARCH,
    async (req, res) => {
        await LeaderboardController.searchPlayerRanking(req, res);
    }
);

router.get(RouteConstants.LEADERBOARD.BY_COUNTRY, (req, res) => {
    res.send(`Leaderboard getting top players group by country ${req.query.country}`);
});

router.post(RouteConstants.LEADERBOARD.RESET, (req, res) => {
    res.send('Leaderboard resetting weekly');
});

router.post(RouteConstants.LEADERBOARD.DISTRIBUTE_REWARDS, (req, res) => {
    res.send('Leaderboard distributing rewards to top players');
});

router.get(
    RouteConstants.LEADERBOARD.PRIZE_POOL,
    async (req, res) => {
        await LeaderboardController.getPrizePool(req, res);
    }
);

export default router;