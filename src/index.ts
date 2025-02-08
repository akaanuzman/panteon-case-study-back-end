import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import { RouteConstants } from './constants/route.constants';
import router from './router';
import { notFoundMiddleware } from './middlewares/not.found.middleware';
import Redis from 'ioredis';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const redis = new Redis();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(RouteConstants.API, router);

// 404 Middleware
app.use(RouteConstants.ALL_ROUTES, notFoundMiddleware);

app.listen(port, async () => {
    try {
        await redis.ping();
        console.log(`⚡️[redis]: Redis is running`);
        console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    } catch (error) {
        console.error('Error connecting to Redis');
    }
});