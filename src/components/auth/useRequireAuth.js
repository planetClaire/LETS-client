// adapted from https://usehooks.com/

import { useEffect } from 'react';
import { useAuth } from './useAuth.js';
import { useRouter } from './useRouter.js';

export default function useRequireAuth(redirectUrl = '/register') {
	const auth = useAuth();
	const router = useRouter();
	// If auth.user is false that means we're not
	// logged in and should redirect.
	useEffect(() => {
		if (auth.user === false) {
			router.push(redirectUrl);
		}
	}, [auth, router, redirectUrl]);
	return auth;
}
