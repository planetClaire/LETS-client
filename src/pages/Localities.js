import { useLazyQuery, gql } from '@apollo/client';

import Loading from '../components/alerts/Loading';
import Alert from '../components/alerts/Error';
import useRequireAuth from '../components/auth/useRequireAuth';
import { useEffect } from 'react';

export default function Localities() {
	const auth = useRequireAuth();

	const GET_LOCALITIES = gql`
		query GetLocalities {
			localities {
				name
				postcode
			}
		}
	`;

	const [getLocalities, { loading, data, error }] =
		useLazyQuery(GET_LOCALITIES);

	useEffect(() => {
		if (auth.user) {
			getLocalities();
		}
	}, [auth, getLocalities]);

	if (!auth || !data || loading) {
		return <Loading />;
	}
	if (error) return <Alert message={error.message} />;

	return data.localities.map(({ name, postcode }) => (
		<div key={name}>
			<p>
				{name}: {postcode}
			</p>
		</div>
	));
}
