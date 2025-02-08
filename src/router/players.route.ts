import express from 'express';
import { RouteConstants } from '../constants/route.constants';

const router = express.Router();

router.post(RouteConstants.PLAYERS.CREATE, (req, res) => {
    res.send("Player create route");
});

router.get(RouteConstants.PLAYERS.SEARCH, (req, res) => {
    res.send(`Player search route with query ${req.query.search}`);
});

router.delete(RouteConstants.PLAYERS.WITH_ID, (req, res) => {
    res.send(`Player delete route with id ${req.params.id}`);
});

router.get(RouteConstants.PLAYERS.WITH_ID, (req, res) => {
    res.send(`Player get route with id ${req.params.id}`);
});

router.put(RouteConstants.PLAYERS.WITH_ID, (req, res) => {
    res.send(`Player update route with id ${req.params.id}`);
});


export default router;