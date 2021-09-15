import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter, Route, Redirect, Router } from 'react-router';
import { render, screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { v4 as uuidv4 } from 'uuid';

import { AuthContext } from './App';
import { LABELS, LETS_GROUP, MESSAGES, TITLES } from './Constants';
import MainMenu from './components/navigation/MainMenu';
import MemberRoute from './components/auth/MemberRoute';
import Members from './pages/Members';
import Login from './components/auth/Login';
import VerifyEmail from './components/auth/VerifyEmail';
import SetupMember from './components/auth/SetupMember';
import { GET_MEMBER } from './graphql/fields';
import Home from './pages/Home';

jest.mock('./components/auth/useGravatar');

const cache = new InMemoryCache({
	typePolicies: {
		Locality: {
			keyFields: ['uid'],
		},
	},
});

function useMockProvideAuth() {
	return { user: false };
}
const provideAuth = useMockProvideAuth();

const component = (mock) => (
	<AuthContext.Provider value={provideAuth}>
		<MockedProvider mocks={mock} cache={cache}>
			<MemoryRouter>
				<MainMenu />
				<MemberRoute path="/members" component={Members} />
				<Route path="/login" component={Login} />
				<Route path="/verifyEmail" component={VerifyEmail} />
				<Route path="/setupMember" component={SetupMember} />
			</MemoryRouter>
		</MockedProvider>
	</AuthContext.Provider>
);

const getMemberRequest = (uid) => {
	return {
		query: GET_MEMBER,
		variables: {
			id: uid,
		},
	};
};

const memberAttributes = (uid) => {
	return {
		id: uid,
		firstName: 'Ilya',
		lastName: 'Volyova',
		localityId: '123',
		phone: '567',
		streetAddress: 'ladeda',
		__typename: 'Member',
	};
};

const waitForApolloToResolve = async () =>
	await waitFor(() => new Promise((resolve) => setTimeout(resolve, 0)));

test('Renders LETS Group name', () => {
	render(component());
	expect(screen.getByText(LETS_GROUP.NAME)).toBeInTheDocument();
});

test('Redirects unauthenticated user to login page on request of a member route', async () => {
	render(component());
	user.click(screen.getByText('Members'));
	await waitForApolloToResolve();
	await waitFor(() => {
		expect(screen.getByText(TITLES.LOGIN)).toBeInTheDocument();
	});
});

test('Redirects authenticated user to email verification page if their email is unverified - no matching member', async () => {
	const uid = 'unverified-user-id';
	provideAuth.user = {
		uid: uid,
		emailVerified: false,
	};
	await waitFor(() =>
		render(
			component([
				{
					request: getMemberRequest(uid),
					result: {
						data: {
							member: null,
						},
					},
				},
			])
		)
	);
	user.click(screen.getByText('Members'));
	await waitForApolloToResolve();
	await waitFor(() => {
		expect(screen.getByText(TITLES.VERIFY_EMAIL)).toBeInTheDocument();
	});
});

test('Redirects authenticated user to email verification page if their email is unverified - matching unapproved member', async () => {
	const uid = '123';
	provideAuth.user = {
		uid: uid,
		emailVerified: false,
	};
	await waitFor(() =>
		render(
			component([
				{
					request: getMemberRequest(uid),
					result: {
						data: {
							member: {
								...memberAttributes(uid),
								approved: false,
							},
						},
					},
				},
			])
		)
	);
	user.click(screen.getByText('Members'));
	await waitForApolloToResolve();
	await waitFor(() => {
		expect(screen.getByText(TITLES.VERIFY_EMAIL)).toBeInTheDocument();
	});
});

test('Redirects authenticated user to email verification page if their email is unverified - matching approved member', async () => {
	const uid = '456';
	provideAuth.user = {
		uid: uid,
		emailVerified: false,
	};
	await waitFor(() =>
		render(
			component([
				{
					request: getMemberRequest(uid),
					result: {
						data: {
							member: {
								...memberAttributes(uid),
								approved: true,
							},
						},
					},
				},
			])
		)
	);
	user.click(screen.getByText('Members'));
	await waitForApolloToResolve();
	await waitFor(() => {
		expect(screen.getByText(TITLES.VERIFY_EMAIL)).toBeInTheDocument();
	});
});

test('Redirects verified user to member setup - no matching member', async () => {
	const uid = '789';
	provideAuth.user = {
		uid: uid,
		emailVerified: true,
	};
	await waitFor(() =>
		render(
			component([
				{
					request: getMemberRequest(uid),
					result: {
						data: {
							member: null,
						},
					},
				},
			])
		)
	);
	user.click(screen.getByText('Members'));
	await waitForApolloToResolve();
	await waitFor(() => {
		expect(
			screen.getByText(TITLES.SETUP_YOUR_MEMBERSHIP)
		).toBeInTheDocument();
	});
});

test('Redirects verified user to member setup - matching unapproved member', async () => {
	const uid = '012';
	provideAuth.user = {
		uid: uid,
		emailVerified: true,
	};
	await waitFor(() =>
		render(
			component([
				{
					request: getMemberRequest(uid),
					result: {
						data: {
							member: {
								...memberAttributes(uid),
								approved: false,
							},
						},
					},
				},
			])
		)
	);
	user.click(screen.getByText('Members'));
	await waitForApolloToResolve();
	await waitFor(() => {
		expect(
			screen.getByText(TITLES.SETUP_YOUR_MEMBERSHIP)
		).toBeInTheDocument();
	});
});

test('Displays Members page to approved member', async () => {
	const uid = '345';
	provideAuth.user = {
		uid: uid,
		emailVerified: true,
	};
	await waitFor(() =>
		render(
			component([
				{
					request: getMemberRequest(uid),
					result: {
						data: {
							member: {
								...memberAttributes(uid),
								approved: true,
							},
						},
					},
				},
			])
		)
	);
	user.click(screen.getByText('Members'));
	await waitForApolloToResolve();
	await waitFor(() => {
		expect(screen.getByText(TITLES.MEMBERS)).toBeInTheDocument();
	});
});

test('Setup member: redirects unauthenticated user to Login', async () => {
	provideAuth.user = false;
	const history = createMemoryHistory();
	history.push('/setupMember');
	await waitFor(() =>
		render(
			<AuthContext.Provider value={provideAuth}>
				<MockedProvider mocks={[]} cache={cache}>
					<Router history={history}>
						<MainMenu />
						<Route path="/login" component={Login} />
						<Route path="/setupMember" component={SetupMember} />
					</Router>
				</MockedProvider>
			</AuthContext.Provider>
		)
	);
	await waitForApolloToResolve();
	await waitFor(() => {
		expect(screen.getByText(TITLES.LOGIN)).toBeInTheDocument();
	});
});

test('Setup Member - redirects already approved member to Home', async () => {
	const history = createMemoryHistory();
	const uid = '345';
	provideAuth.user = {
		uid: uid,
		emailVerified: true,
	};
	history.push('/setupMember');
	await waitFor(() =>
		render(
			<AuthContext.Provider value={provideAuth}>
				<MockedProvider
					mocks={[
						{
							request: getMemberRequest(uid),
							result: {
								data: {
									member: {
										...memberAttributes(uid),
										approved: true,
									},
								},
							},
						},
					]}
					cache={cache}
				>
					<Router history={history}>
						<MainMenu />
						<Route path="/" component={Home} />
						<Route path="/setupMember" component={SetupMember} />
					</Router>
				</MockedProvider>
			</AuthContext.Provider>
		)
	);
	await waitForApolloToResolve();
	await waitFor(() => {
		expect(screen.getByText(TITLES.HOME)).toBeInTheDocument();
	});
});

test('Setup member - displays setup form for non-existing member (verified user)', async () => {
	const history = createMemoryHistory();
	const uid = '678';
	provideAuth.user = {
		uid: uid,
		emailVerified: true,
	};
	history.push('/setupMember');
	await waitFor(() =>
		render(
			<AuthContext.Provider value={provideAuth}>
				<MockedProvider
					mocks={[
						{
							request: getMemberRequest(uid),
							result: { data: { member: null } },
						},
					]}
					cache={cache}
				>
					<Router history={history}>
						<MainMenu />
						<Route path="/" component={Home} />
						<Route path="/setupMember" component={SetupMember} />
					</Router>
				</MockedProvider>
			</AuthContext.Provider>
		)
	);
	await waitForApolloToResolve();
	await waitFor(() => {
		expect(
			screen.getByText(TITLES.SETUP_YOUR_MEMBERSHIP)
		).toBeInTheDocument();
		expect(
			screen.getByRole('textbox', { name: LABELS.FIRST_NAME })
		).toBeInTheDocument();
	});
});

test('Setup member - displays already applied message to unapproved member', async () => {
	const history = createMemoryHistory();
	const uid = uuidv4();
	provideAuth.user = {
		uid: uid,
		emailVerified: true,
	};
	history.push('/setupMember');
	await waitFor(() =>
		render(
			<AuthContext.Provider value={provideAuth}>
				<MockedProvider
					mocks={[
						{
							request: getMemberRequest(uid),
							result: {
								data: {
									member: {
										...memberAttributes(uid),
										approved: false,
									},
								},
							},
						},
					]}
					cache={cache}
				>
					<Router history={history}>
						<MainMenu />
						<Route path="/" component={Home} />
						<Route path="/setupMember" component={SetupMember} />
					</Router>
				</MockedProvider>
			</AuthContext.Provider>
		)
	);
	await waitForApolloToResolve();
	await waitFor(() => {
		expect(
			screen.getByText(TITLES.SETUP_YOUR_MEMBERSHIP)
		).toBeInTheDocument();
		expect(screen.getByText(MESSAGES.SETUP_SUBMITTED)).toBeInTheDocument();
		expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
	});
});
