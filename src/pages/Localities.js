import { useQuery } from '@apollo/client';

import Loading from '../components/alerts/Loading';
import Alert from '../components/alerts/Error';
import Main from '../components/Main';
import Header from '../components/Header';
import { GET_LOCALITIES } from '../graphql/fields';

export default function Localities() {
	const { loading, error, data } = useQuery(GET_LOCALITIES);

	if (loading) return <Loading />;
	if (error) return <Alert message={error.message} />;

	return (
		<>
			<Header title="Localities"></Header>
			<Main>
				{data.localities.map(({ name, postcode }) => (
					<div key={name}>
						<p>
							{name}: {postcode}
						</p>
					</div>
				))}
				;
			</Main>
		</>
	);
}
