import React from 'react';
import { Component } from 'react';

import authService from './AuthorizeService';
import {
	QUERY_PARAMETER_NAMES,
	LOGOUT_ACTIONS,
	APPLICATION_PATHS,
	AUTHENTICATION_RESULT_STATUS,
} from '../Constants';
import Loading from '../alerts/Loading';
import Success from '../alerts/Success';

// The main responsibility of this component is to handle the user's logout process.
// This is the starting point for the logout process, which is usually initiated when a
// user clicks on the logout button on the LoginMenu component.
export class Logout extends Component {
	constructor(props) {
		super(props);

		this.state = {
			message: undefined,
			isReady: false,
			authenticated: false,
		};
	}

	componentDidMount() {
		const action = this.props.action;
		switch (action) {
			case LOGOUT_ACTIONS.LOGOUT:
				if (!!window.history.state.state.local) {
					this.logout(this.getReturnUrl());
				} else {
					// This prevents regular links to <app>/authentication/logout from triggering a logout
					this.setState({
						isReady: true,
						message: 'The logout was not initiated from within the page.',
					});
				}
				break;
			case LOGOUT_ACTIONS.LOGOUT_CALLBACK:
				this.processLogoutCallback();
				break;
			case LOGOUT_ACTIONS.LOGGED_OUT:
				this.setState({
					isReady: true,
					message: 'You successfully logged out!',
				});
				break;
			default:
				throw new Error(`Invalid action '${action}'`);
		}

		this.populateAuthenticationState();
	}

	render() {
		const { isReady, message } = this.state;
		if (!isReady) {
			return <div></div>;
		}
		if (!!message) {
			return <Success message={message} />;
		} else {
			const action = this.props.action;
			switch (action) {
				case LOGOUT_ACTIONS.LOGOUT:
					return <Loading />;
				case LOGOUT_ACTIONS.LOGOUT_CALLBACK:
					return <Loading />;
				case LOGOUT_ACTIONS.LOGGED_OUT:
					return <Success message={message} />;
				default:
					throw new Error(`Invalid action '${action}'`);
			}
		}
	}

	async logout(returnUrl) {
		const state = { returnUrl };
		const isauthenticated = await authService.isAuthenticated();
		if (isauthenticated) {
			const result = await authService.signOut(state);
			switch (result.status) {
				case AUTHENTICATION_RESULT_STATUS.REDIRECT:
					break;
				case AUTHENTICATION_RESULT_STATUS.SUCCESS:
					await this.navigateToReturnUrl(returnUrl);
					break;
				case AUTHENTICATION_RESULT_STATUS.FAIL:
					this.setState({ message: result.message });
					break;
				default:
					throw new Error('Invalid authentication result status.');
			}
		} else {
			this.setState({ message: 'You successfully logged out!' });
		}
	}

	async processLogoutCallback() {
		const url = window.location.href;
		const result = await authService.completeSignOut(url);
		switch (result.status) {
			case AUTHENTICATION_RESULT_STATUS.REDIRECT:
				// There should not be any redirects as the only time completeAuthentication finishes
				// is when we are doing a redirect sign in flow.
				throw new Error('Should not redirect.');
			case AUTHENTICATION_RESULT_STATUS.SUCCESS:
				await this.navigateToReturnUrl(this.getReturnUrl(result.state));
				break;
			case AUTHENTICATION_RESULT_STATUS.FAIL:
				this.setState({ message: result.message });
				break;
			default:
				throw new Error('Invalid authentication result status.');
		}
	}

	async populateAuthenticationState() {
		const authenticated = await authService.isAuthenticated();
		this.setState({ isReady: true, authenticated });
	}

	getReturnUrl(state) {
		const params = new URLSearchParams(window.location.search);
		const fromQuery = params.get(QUERY_PARAMETER_NAMES.RETURN_URL);
		if (fromQuery && !fromQuery.startsWith(`${window.location.origin}/`)) {
			// This is an extra check to prevent open redirects.
			throw new Error(
				'Invalid return url. The return url needs to have the same origin as the current page.'
			);
		}
		return (
			(state && state.returnUrl) ||
			fromQuery ||
			`${window.location.origin}${APPLICATION_PATHS.LOGGED_OUT}`
		);
	}

	navigateToReturnUrl(returnUrl) {
		return window.location.replace(returnUrl);
	}
}
