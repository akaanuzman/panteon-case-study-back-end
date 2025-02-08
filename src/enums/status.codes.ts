/**
 * @description This enum returns the status codes for the server responses.
 * @enum StatusCodes
 * @property OK - 200
 * @property CREATED - 201
 * @property NO_CONTENT - 204
 * @property BAD_REQUEST - 400
 * @property UNAUTHORIZED - 401
 * @property FORBIDDEN - 403
 * @property NOT_FOUND - 404
 * @property TOO_MANY_REQUESTS - 429
 * @property INTERNAL_SERVER_ERROR - 500
 */
export enum StatusCodes {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    TOO_MANY_REQUESTS = 429,
    INTERNAL_SERVER_ERROR = 500,
}