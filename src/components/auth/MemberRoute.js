import { Route, Redirect } from 'react-router-dom';

import { useAuth } from './useAuth';

export default function MemberRoute({ component: Component, ...rest }) {
	let auth = useAuth();

	return (
		<Route
			{...rest}
			render={({ location }) => {
				if (auth.user === false) {
					return (
						<Redirect
							to={{
								pathname: '/login',
								state: { pathname: location.pathname },
							}}
						/>
					);
				} else if (auth.user && !auth.user.emailVerified) {
					return <Redirect to={{ pathname: '/verifyEmail' }} />;
				}
				return <Component />;
			}}
		/>
	);
}
