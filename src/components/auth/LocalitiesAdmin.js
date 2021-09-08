import { useQuery } from '@apollo/client';

import Header from '../Header';
import Main from '../Main';
import Loading from '../alerts/Loading';
import Alert from '../alerts/Error';
import { GET_LOCALITIES } from '../../graphql/fields';

export default function LocalitiesAdmin() {
	const { loading, error, data } = useQuery(GET_LOCALITIES);

	if (loading) return <Loading />;
	if (error) return <Alert message={error.message} />;

	return (
		<>
			<Header title="Localities Admin"></Header>
			<Main>
				{data.localities.map(({ name, postcode }) => (
					<div key={name}>
						<p>
							{name}: {postcode}
						</p>
					</div>
				))}
			</Main>
		</>
	);
}
