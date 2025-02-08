/**
 * Enum representing country codes for players.
 * Uses ISO 3166-1 alpha-2 country codes for international standardization.
 * Each country code is a two-letter identifier representing a specific country.
 */
export enum PlayerCountries {
    /** United States of America - North American region */
    USA = 'US',

    /** United Kingdom - European region (includes England, Scotland, Wales, Northern Ireland) */
    UNITED_KINGDOM = 'GB',

    /** Germany (Deutschland) - Central European region */
    GERMANY = 'DE',

    /** France - Western European region */
    FRANCE = 'FR',

    /** Turkey (Türkiye) - Eurasian region */
    TURKEY = 'TR',

    /** Italy (Italia) - Southern European region */
    ITALY = 'IT',

    /** Spain (España) - Southern European region */
    SPAIN = 'ES',

    /** Brazil (Brasil) - South American region */
    BRAZIL = 'BR',

    /** India (Bhārat) - South Asian region */
    INDIA = 'IN',

    /** China (Zhōngguó) - East Asian region */
    CHINA = 'CN',

    /** Japan (Nippon) - East Asian region */
    JAPAN = 'JP',

    /** South Korea (Hanguk) - East Asian region */
    SOUTH_KOREA = 'KR',

    /** Canada - North American region */
    CANADA = 'CA',

    /** Australia - Oceania region */
    AUSTRALIA = 'AU',

    /** Netherlands (Nederland) - Western European region */
    NETHERLANDS = 'NL',

    /** Sweden (Sverige) - Northern European region */
    SWEDEN = 'SE',

    /** Norway (Norge) - Northern European region */
    NORWAY = 'NO',

    /** Mexico (México) - North American region */
    MEXICO = 'MX',

    /** Russia (Rossiya) - Eurasian region */
    RUSSIA = 'RU',

    /** Argentina - South American region */
    ARGENTINA = 'AR',

    /** Poland (Polska) - Central European region */
    POLAND = 'PL',

    /** Switzerland (Schweiz/Suisse/Svizzera) - Central European region */
    SWITZERLAND = 'CH',

    /** Portugal - Southern European region */
    PORTUGAL = 'PT',

    /** Greece (Hellas) - Southern European region */
    GREECE = 'GR',

    /** Ireland - Northern European region */
    IRELAND = 'IE'
}

/**
 * Array of all country codes for random selection.
 * Generated from PlayerCountries enum values.
 * Used for random country assignment in player generation.
 * 
 * @example
 * const randomCountry = COUNTRY_CODES[Math.floor(Math.random() * COUNTRY_CODES.length)];
 */
export const COUNTRY_CODES = Object.values(PlayerCountries);

/**
 * Total number of supported countries
 */
export const TOTAL_COUNTRIES = COUNTRY_CODES.length;