const PROD = {};

const DEV = {
	URL: 'http://localhost:3000',
	GRAPHQL_URL: 'https://localhost:5002/graphql',
	MEMBER_SETUP_URL: 'http://localhost:3000/setupMember',
};

export const CONFIG = process.env.NODE_ENV === 'development' ? DEV : PROD;

export const LETS_GROUP = {
	NAME: 'Your LETS Group',
	COUNTRY: 'Australia',
	STATE_PROVINCE: 'Western Australia',
};

export const TITLES = {
	HOME: `Welcome to ${LETS_GROUP.NAME}`,
	VERIFY_EMAIL: 'Verify your email address',
	LOGIN: 'Login to your account',
	SETUP_YOUR_MEMBERSHIP: 'Set up your membership',
	MEMBERS: 'Members list',
	LOCALITIES_ADMIN: 'Localities Admin',
};

export const LABELS = {
	FIRST_NAME: 'First name',
};

export const MESSAGES = {
	SETUP_SUBMITTED: `You've successfully submitted your application for membership to ${LETS_GROUP.NAME}. Your details will be checked and you will hear from us when your application has been processed.`,
};
