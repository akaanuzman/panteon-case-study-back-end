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
         * Endpoint for searching player by username and returning surrounding rankings
         * @type {string}
         * @default "/search"
         */
        SEARCH: "/search",

        /**
         * Endpoint for resetting the leaderboard weekly
         * @type {string}
         * @default "/reset"
         */
        RESET: "/reset",

        /**
         * Endpoint for getting prize pool
         * @type {string}
         * @default "/prize-pool"
         */
        PRIZE_POOL: "/prize-pool",

        /**
         * Endpoint for autocomplete search
         * @type {string}
         * @default "/autocomplete"
         */
        AUTOCOMPLETE: "/autocomplete"
    },

    /**
     * Endpoint for seed 10m players
     * @constant
     * @type {string}
     * @default "/seed-players"
     */
    SEED_PLAYERS: "/seed-players",
};