import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import { RouteConstants } from './constants/route.constants';
import router from './router';
import { notFoundMiddleware } from './middlewares/not.found.middleware';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(RouteConstants.API, router);

// 404 Middleware
app.use(RouteConstants.ALL_ROUTES, notFoundMiddleware);

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});