import { Request, Response } from "express";
import { StatusCodes } from "../enums/status.codes";

// This middleware is used to handle the 404 errors.
export const notFoundMiddleware = (_: Request, res: Response) => {
    res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "This page doesn't exist." })
}