const PROD = {};

const DEV = {
	URL: 'http://localhost:3000',
	GRAPHQL_URL: 'https://localhost:5002/graphql',
};

export const CONFIG = process.env.NODE_ENV === 'development' ? DEV : PROD;

export const LETS_GROUP_NAME = 'Your LETS Group';
