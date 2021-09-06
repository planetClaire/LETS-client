import { useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { useAuth } from './useAuth';

export default function MemberRoute({ component: Component, ...rest }) {
	let auth = useAuth();
	let [user, setUser] = useState();
	useEffect(() => {
		if (auth.user !== undefined && auth.user !== null) {
			setUser(auth.user);
		}
	}, [auth]);
	return (
		user !== undefined && (
			<Route
				{...rest}
				render={({ location }) => {
					if (user === false) {
						return (
							<Redirect
								to={{
									pathname: '/login',
									state: { pathname: location.pathname },
								}}
							/>
						);
					} else if (!user.emailVerified) {
						return <Redirect to={{ pathname: '/verifyEmail' }} />;
					}
					return <Component />;
				}}
			/>
		)
	);
}
