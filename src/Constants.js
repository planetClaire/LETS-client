const PROD = {};

const DEV = {
	URL: 'http://localhost:3000',
	GRAPHQL_URL: 'https://localhost:5002/graphql',
};

export const CONFIG = process.env.NODE_ENV === 'development' ? DEV : PROD;

export const LETS_GROUP_NAME = 'Your LETS Group';

export const LOGIN_ACTIONS = {
	LOGIN: 'login',
	LOGIN_CALLBACK: 'login-callback',
	LOGIN_FAILED: 'login-failed',
	PROFILE: 'profile',
};

export const LOGOUT_ACTIONS = {
	LOGOUT_CALLBACK: 'logout-callback',
	LOGOUT: 'logout',
	LOGGED_OUT: 'logged-out',
};

export const AUTH_PREFIX = '/authentication';

export const APPLICATION_PATHS = {
	LOGIN: `${AUTH_PREFIX}/${LOGIN_ACTIONS.LOGIN}`,
	LOGIN_FAILED: `${AUTH_PREFIX}/${LOGIN_ACTIONS.LOGIN_FAILED}`,
	LOGIN_CALLBACK: `${AUTH_PREFIX}/${LOGIN_ACTIONS.LOGIN_CALLBACK}`,
	PROFILE: `${AUTH_PREFIX}/${LOGIN_ACTIONS.PROFILE}`,
	LOGOUT: `${AUTH_PREFIX}/${LOGOUT_ACTIONS.LOGOUT}`,
	LOGGED_OUT: `${AUTH_PREFIX}/${LOGOUT_ACTIONS.LOGGED_OUT}`,
	LOGOUT_CALLBACK: `${AUTH_PREFIX}/${LOGOUT_ACTIONS.LOGOUT_CALLBACK}`,
	IDENTITY_MANAGE: 'Identity/Account/Manage',
};

export const AUTHENTICATION_RESULT_STATUS = {
	REDIRECT: 'redirect',
	SUCCESS: 'success',
	FAIL: 'fail',
};

export const QUERY_PARAMETER_NAMES = {
	RETURN_URL: 'returnUrl',
	MESSAGE: 'message',
};

export const IDENTITY = {
	CLIENT_ID: 'lets-js-client',
	REDIRECT_URI: `${CONFIG.URL}${APPLICATION_PATHS.LOGIN_CALLBACK}`,
	SCOPE: 'openid profile letsgql',
	POST_LOGOUT_REDIRECT_URI: `${CONFIG.URL}${APPLICATION_PATHS.LOGOUT_CALLBACK}`,
};
