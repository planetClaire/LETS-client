import { useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';

import { useAuth } from './useAuth';
import { GET_MEMBER } from '../../graphql/fields';

export default function MemberRoute({ component: Component, ...rest }) {
	const auth = useAuth();
	const [user, setUser] = useState();

	const [getMember, { loading, error, data }] = useLazyQuery(GET_MEMBER);

	useEffect(() => {
		if (auth.user !== undefined && auth.user !== null) {
			setUser(auth.user);
			if (auth.user) {
				getMember({
					variables: { id: auth.user.uid },
				});
			}
		}
	}, [auth, getMember]);

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
					} else if (
						data === undefined ||
						!data.member ||
						!data.member.approved
					) {
						return <Redirect to="/setupMember" />;
					}
					return <Component />;
				}}
			/>
		)
	);
}
