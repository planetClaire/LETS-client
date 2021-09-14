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
	VERIFY_EMAIL: 'Verify your email address',
	LOGIN: 'Login to your account',
};
