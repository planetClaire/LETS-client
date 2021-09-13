import { useState, useEffect, useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../../App';

export default function AdminRoute({ component: Component, ...rest }) {
	const auth = useContext(AuthContext);
	const [, setUser] = useState();
	const [isAdmin, setIsAdmin] = useState(false);
	const [ready, setReady] = useState(false);

	useEffect(() => {
		if (auth.user !== undefined && auth.user !== null) {
			setUser(auth.user);
			if (auth.user) {
				auth.user
					.getIdTokenResult()
					.then((idTokenResult) => {
						setIsAdmin(!!idTokenResult.claims.admin);
						setReady(true);
					})
					.catch((error) => {
						console.log(error);
					});
			} else {
				setReady(true);
			}
		}
	}, [auth]);

	return (
		ready && (
			<Route
				{...rest}
				render={() => {
					if (!isAdmin) {
						return <Redirect to="/" />;
					}
					return <Component />;
				}}
			/>
		)
	);
}
