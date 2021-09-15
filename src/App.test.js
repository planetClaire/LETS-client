import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter, Route } from 'react-router';
import { render, screen, wait, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';

import { AuthContext } from './App';
import { LETS_GROUP, TITLES } from './Constants';
import MainMenu from './components/navigation/MainMenu';
import MemberRoute from './components/auth/MemberRoute';
import Members from './pages/Members';
import Login from './components/auth/Login';
import VerifyEmail from './components/auth/VerifyEmail';
import SetupMember from './components/auth/SetupMember';
import { GET_MEMBER } from './graphql/fields';

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
