export const AUTH_STATE_COOKIE_NAME = "topwr_auth";

/**
 * When an access token has less than this percentage of its total lifetime remaining,
 * a background refresh is triggered alongside the outgoing request.
 */
export const REFRESH_THRESHOLD_PERCENT = 20;
