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
import { useAuth } from './components/auth/useAuth';
import Loading from './components/alerts/Loading';
import Alert from './components/alerts/Error';

import './index.css';
import { CONFIG } from './Constants';

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
				graphQLErrors.map(({ message, locations, path }) => {
					console.log(
						`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
					);
					setError(message);
					return null;
				});
			}
			if (networkError) {
				console.log(`[Network error]: ${networkError}`);
			}
		});

		const authLink = setContext(async (_, { headers }) => {
			let token = auth && (await auth.user.getIdToken());
			// return the headers to the context so httpLink can read them
			return {
				headers: {
					...headers,
					authorization: token ? `Bearer ${token}` : '',
				},
			};
		});

		const cache = new InMemoryCache();

		const client = new ApolloClient({
			link: authLink.concat(from([errorLink, httpLink])),
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
					<Route exact path="/members" component={Members} />
					<Route exact path="/login" component={Login} />
					<Route exact path="/register" component={Register} />
					<Route path="/localities" component={Localities} />
				</div>
			</BrowserRouter>
		</ApolloProvider>
	);
}

export default App;
