import { ROUTES } from '@/constants/routes';

export const LOGIN_ROUTE = '/login';

/** Where a user lands after signing in. */
export const HOME_ROUTE = ROUTES.overview;

export const SESSION_COOKIE_NAME = 'kyc_defect_hub_session';

// A session ends this long after signing in, however active the user is.
export const SESSION_DURATION_HOURS = 8;
