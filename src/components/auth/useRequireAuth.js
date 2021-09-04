import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { useAuth } from './useAuth';

export default function useRequireAuth(redirectUrl = '/login') {
	const auth = useAuth();
	const history = useHistory();
	const location = useLocation();
	const pathname = location.pathname;
	useEffect(() => {
		// check for auth.user === false here rather than !auth.user since the status is set to false onAuthStateChanged)
		if (auth.user === false) {
			history.push(redirectUrl, pathname);
		}
	}, [auth, history, redirectUrl, pathname]);
	return auth;
}
