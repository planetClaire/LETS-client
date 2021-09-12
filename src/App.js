import { BrowserRouter, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	from,
	HttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

import Home from './pages/Home';
import Members from './pages/Members';
import Localities from './pages/Localities';
import MainMenu from './components/navigation/MainMenu';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import VerifyEmail from './components/auth/VerifyEmail';
import { useAuth } from './components/auth/useAuth';
import Loading from './components/alerts/Loading';
import Alert from './components/alerts/Error';

import './index.css';
import { CONFIG } from './Constants';
import MemberRoute from './components/auth/MemberRoute';
import SetupMember from './components/auth/SetupMember';
import AdminRoute from './components/auth/AdminRoute';
import LocalitiesAdmin from './components/auth/LocalitiesAdmin';

function App() {
	const auth = useAuth();
	const [client, setClient] = useState();
	const [error, setError] = useState();

	useEffect(() => {
		const httpLink = new HttpLink({
			uri: CONFIG.GRAPHQL_URL,
		});

		const errorLink = onError(({ graphQLErrors, networkError }) => {
			if (graphQLErrors) {
				graphQLErrors.map(({ message, path }) => {
					console.log(
						`[GraphQL error]: Message: ${message}, Path: ${path}`
					);
					setError(message);
					return null;
				});
			}
			if (networkError) {
				setError(`[Network error]: ${networkError}`);
				return null;
			}
		});

		const authLink = setContext(async (_, { headers }) => {
			let token = auth && auth.user && (await auth.user.getIdToken());
			// return the headers to the context so httpLink can read them
			return {
				headers: {
					...headers,
					authorization: token ? `Bearer ${token}` : '',
				},
			};
		});

		const cache = new InMemoryCache({
			typePolicies: {
				Locality: {
					keyFields: ['uid'],
				},
			},
		});

		const client = new ApolloClient({
			link: authLink.concat(from([errorLink, httpLink])),
			connectToDevTools: true,
			cache,
			defaultOptions: {
				watchQuery: {
					errorPolicy: 'all',
				},
				query: {
					errorPolicy: 'all',
				},
				mutate: {
					errorPolicy: 'all',
				},
			},
		});

		setClient(client);

		return () => {};
	}, [auth]);

	if (client === undefined) return <Loading />;
	return (
		<ApolloProvider client={client}>
			<BrowserRouter>
				<MainMenu />
				<div className="min-h-screen bg-gray-50 py-6 sm:px-6 lg:px-8">
					{error && <Alert message={error} />}
					<Route exact path="/" component={Home} />
					<MemberRoute path="/members" component={Members} />
					<MemberRoute path="/localities" component={Localities} />
					<AdminRoute
						path="/admin/localities"
						component={LocalitiesAdmin}
					/>
					<Route path="/login" component={Login} />
					<Route path="/register" component={Register} />
					<Route path="/verifyEmail" component={VerifyEmail} />
					<Route path="/setupMember" component={SetupMember} />
				</div>
			</BrowserRouter>
		</ApolloProvider>
	);
}

export default App;
