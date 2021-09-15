import { useEffect, useState, useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';

import { GET_MEMBER } from '../../graphql/fields';
import { AuthContext } from '../../App';
import Loading from '../alerts/Loading';

export default function MemberRoute({ component: Component, ...rest }) {
	const auth = useContext(AuthContext);
	const [user, setUser] = useState(undefined);

	const [getMember, { data: memberData, loading }] = useLazyQuery(GET_MEMBER);
	useEffect(() => {
		if (auth.user !== undefined && auth.user !== null) {
			setUser(auth.user);
			if (auth.user) {
				getMember({
					variables: { id: auth.user.uid },
				});
			}
		}
	}, [auth.user, getMember]);

	// must return a wrapper for Route
	return (
		<Route
			{...rest}
			render={({ location }) => {
				// perform logic here
				if (user === undefined) {
					return <Loading />;
				}
				if (user === false) {
					return (
						<Redirect
							to={{
								pathname: '/login',
								state: { pathname: location.pathname },
							}}
						/>
					);
				}
				if (!user.emailVerified) {
					return <Redirect to="/verifyEmail" />;
				}
				if (memberData === undefined || loading) {
					return <Loading />;
				}
				if (memberData.member === null || !memberData.member.approved) {
					return <Redirect to="/setupMember" />;
				}
				return <Component />;
			}}
		/>
	);
}
