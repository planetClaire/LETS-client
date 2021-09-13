import { render, screen, waitFor } from '@testing-library/react';
import { AuthContext } from './App';
import Members from './pages/Members';
import Login from './components/auth/Login';
import { LETS_GROUP } from './Constants';
import { MockedProvider } from '@apollo/client/testing';
import { InMemoryCache } from '@apollo/client';
import Home from './pages/Home';
import MainMenu from './components/navigation/MainMenu';
import { MemoryRouter, Route } from 'react-router';
import MemberRoute from './components/auth/MemberRoute';
import user from '@testing-library/user-event';

const cache = new InMemoryCache();

function useMockProvideAuth() {
	return { user: false };
}
const provideAuth = useMockProvideAuth();

test('renders LETS Group name', () => {
	render(
		<AuthContext.Provider value={provideAuth}>
			<MemoryRouter>
				<MainMenu />
				<Home />
			</MemoryRouter>
		</AuthContext.Provider>
	);
	expect(screen.getByText(LETS_GROUP.NAME)).toBeInTheDocument();
});

test('on request of a member route, kicks unauthenticated user to login page', async () => {
	render(
		<AuthContext.Provider value={provideAuth}>
			<MockedProvider mocks={[]} cache={cache}>
				<MemoryRouter>
					<MainMenu />
					<MemberRoute path="/members" component={Members} />
					<Route path="/login" component={Login} />
				</MemoryRouter>
			</MockedProvider>
		</AuthContext.Provider>
	);
	user.click(screen.getByText('Members'));
	await waitFor(() => {
		expect(screen.getByText('Login to your account')).toBeInTheDocument();
	});
});
