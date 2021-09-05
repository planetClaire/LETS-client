import { useQuery, gql } from '@apollo/client';

import Loading from '../components/alerts/Loading';
import Alert from '../components/alerts/Error';

export default function Localities() {
	const GET_LOCALITIES = gql`
		query GetLocalities {
			localities {
				name
				postcode
			}
		}
	`;

	const { loading, error, data } = useQuery(GET_LOCALITIES);

	if (loading) return <Loading />;
	if (error) return <Alert message={error.message} />;

	return data.localities.map(({ name, postcode }) => (
		<div key={name}>
			<p>
				{name}: {postcode}
			</p>
		</div>
	));
}
