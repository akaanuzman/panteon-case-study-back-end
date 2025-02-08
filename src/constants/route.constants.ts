/**
 * Route constants used throughout the application
 * @namespace RouteConstants
 */
export const RouteConstants = {
    /**
     * Base API endpoint
     * @constant
     * @type {string}
     * @default "/api"
     */
    API: "/api",

    /**
     * Wildcard route for 404 handling
     * @constant
     * @type {string}
     * @default "*"
     */
    ALL_ROUTES: "*",

    /**
     * Player management endpoints
     * @constant
     * @type {string}
     * @default "/players"
     */
    PLAYERS: {
        /**
         * Base player endpoint
         * @type {string}
         * @default "/players"
         */
        BASE: "/players",

        /**
         * Endpoint for creating a new player
         * @type {string}
         * @default "/create"
         */
        CREATE: "/create",

        /**
         * Endpoint for getting player info, updating player info
         * or deleting a player
         * @type {string}
         * @default "/:id"
         */
        WITH_ID: "/:id",

        /**
         * Endpoint for getting search results
         * @type {string}
         * @default "/search"
         */
        SEARCH: "/search"
    },

    /**
     * Leaderboard related endpoints
     * @constant
     * @type {Object}
     */
    LEADERBOARD: {
        /**
         * Base leaderboard endpoint
         * @type {string}
         * @default "/leaderboard"
         */
        BASE: "/leaderboard",

        /**
         * Endpoint for getting top 100 players
         * @type {string}
         * @default "/top"
         */
        TOP: "/top",

        /**
         * Endpoint for returns the rank of the specified player and 5 surrounding players.
         * @type {string}
         * @default "/rank/:id"
         */
        RANK: "/rank/:id",

        /**
         * Endpoint for getting top players group by country
         * @type {string}
         * @default "/group-by-country"
         */
        BY_COUNTRY: "/group-by-country",

        /**
         * Endpoint for resetting the leaderboard weekly
         * @type {string}
         * @default "/reset"
         */
        RESET: "/reset",

        /**
         * Endpoint for distributing rewards to top players
         * @type {string}
         * @default "/distribute-rewards"
         */
        DISTRIBUTE_REWARDS: "/distribute-rewards",

        /**
         * Endpoint for getting prize pool
         * @type {string}
         * @default "/prize-pool"
         */
        PRIZE_POOL: "/prize-pool"
    },

    // OPTIONAL
    /**
     * Websocket related endpoints
     * @constant
     * @type {Object}
     */
    WEBSOCKET: {
        /**
         * Base websocket endpoint
         * @type {string}
         * @default "/ws"
         */
        BASE: "/ws",

        /**
         * Endpoint for leaderboard updates
         * @type {string}
         * @default "/leaderboard"
         */
        LEADERBOARD: "/leaderboard",

        /**
         * Endpoint for prize pool updates
         * @type {string}
         * @default "/prize-pool"
         */
        PLAYERS: "/prize-pool"
    }
};