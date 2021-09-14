import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter, Route } from 'react-router';
import { render, screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';

import { AuthContext } from './App';
import { LETS_GROUP, TITLES } from './Constants';
import MainMenu from './components/navigation/MainMenu';
import MemberRoute from './components/auth/MemberRoute';
import Members from './pages/Members';
import Login from './components/auth/Login';
import VerifyEmail from './components/auth/VerifyEmail';
import { GET_MEMBER } from './graphql/fields';

jest.mock('./components/auth/useGravatar');

const cache = new InMemoryCache();

function useMockProvideAuth() {
	return { user: false };
}
const provideAuth = useMockProvideAuth();

const mockNullMember = [
	{
		request: {
			query: GET_MEMBER,
			variables: {
				id: 'userid',
			},
		},
		result: {
			data: {
				member: null,
			},
		},
	},
];

const mockUnapprovedMember = [
	{
		request: {
			query: GET_MEMBER,
			variables: {
				id: 'userid',
			},
		},
		result: {
			data: {
				member: {
					approved: false,
					__typename: 'Member',
				},
			},
		},
	},
];

const mockApprovedMember = [
	{
		request: {
			query: GET_MEMBER,
			variables: {
				id: 'userid',
			},
		},
		result: {
			data: {
				member: {
					approved: true,
					__typename: 'Member',
				},
			},
		},
	},
];

const component = (mock) => (
	<AuthContext.Provider value={provideAuth}>
		<MockedProvider mocks={mock} cache={cache}>
			<MemoryRouter>
				<MainMenu />
				<MemberRoute path="/members" component={Members} />
				<Route path="/verifyEmail" component={VerifyEmail} />
				<Route path="/login" component={Login} />
			</MemoryRouter>
		</MockedProvider>
	</AuthContext.Provider>
);

const unverifiedUser = {
	uid: 'userid',
	email: 'email@example.com',
	emailVerified: false,
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
	await waitFor(() => {
		expect(screen.getByText(TITLES.LOGIN)).toBeInTheDocument();
	});
});

test('Redirects authenticated user to email verification page if their email is unverified - no matching member', async () => {
	provideAuth.user = unverifiedUser;
	await waitFor(() => render(component(mockNullMember)));
	await waitForApolloToResolve();
	user.click(screen.getByText('Members'));
	await waitFor(() =>
		expect(screen.getByText(TITLES.VERIFY_EMAIL)).toBeInTheDocument()
	);
});

test('Redirects authenticated user to email verification page if their email is unverified - matching unapproved member', async () => {
	provideAuth.user = unverifiedUser;
	await waitFor(() => render(component(mockUnapprovedMember)));
	await waitForApolloToResolve();
	user.click(screen.getByText('Members'));
	await waitFor(() =>
		expect(screen.getByText(TITLES.VERIFY_EMAIL)).toBeInTheDocument()
	);
});

test('Redirects authenticated user to email verification page if their email is unverified - matching approved member', async () => {
	provideAuth.user = unverifiedUser;
	await waitFor(() => render(component(mockApprovedMember)));
	await waitForApolloToResolve();
	user.click(screen.getByText('Members'));
	await waitFor(() =>
		expect(screen.getByText(TITLES.VERIFY_EMAIL)).toBeInTheDocument()
	);
});
