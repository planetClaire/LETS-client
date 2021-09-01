import React, { Component } from 'react';

import authService from '../../AuthorizeService';
import {
	LOGIN_ACTIONS,
	QUERY_PARAMETER_NAMES,
	APPLICATION_PATHS,
	AUTHENTICATION_RESULT_STATUS,
} from '../../Constants';
import Success from '../alerts/Success';

// The main responsibility of this component is to handle the user's login process.
// This is the starting point for the login process. Any component that needs to authenticate
// a user can simply perform a redirect to this component with a returnUrl query parameter and
// let the component perform the login and return back to the return url.
export class Login extends Component {
	constructor(props) {
		super(props);

		this.state = {
			message: undefined,
		};
	}

	componentDidMount() {
		const action = this.props.action;
		switch (action) {
			case LOGIN_ACTIONS.LOGIN:
				this.login(this.getReturnUrl());
				break;
			case LOGIN_ACTIONS.LOGIN_CALLBACK:
				this.processLoginCallback();
				break;
			case LOGIN_ACTIONS.LOGIN_FAILED:
				const params = new URLSearchParams(window.location.search);
				const error = params.get(QUERY_PARAMETER_NAMES.MESSAGE);
				this.setState({ message: error });
				break;
			case LOGIN_ACTIONS.PROFILE:
				this.redirectToProfile();
				break;
			default:
				throw new Error(`Invalid action '${action}'`);
		}
	}

	render() {
		const action = this.props.action;
		const { message } = this.state;
		if (!!message) {
			return <div>{message}</div>;
		} else {
			switch (action) {
				case LOGIN_ACTIONS.LOGIN:
					return <Success message="Processing login" />;
				case LOGIN_ACTIONS.LOGIN_CALLBACK:
					return <Success message="Processing login" />;
				case LOGIN_ACTIONS.PROFILE:
					return <div></div>;
				default:
					throw new Error(`Invalid action '${action}'`);
			}
		}
	}

	async login(returnUrl) {
		const state = { returnUrl };
		const result = await authService.signIn(state);
		switch (result.status) {
			case AUTHENTICATION_RESULT_STATUS.REDIRECT:
				break;
			case AUTHENTICATION_RESULT_STATUS.SUCCESS:
				await this.navigateToReturnUrl(returnUrl);
				break;
			case AUTHENTICATION_RESULT_STATUS.FAIL:
				this.setState({ message: result.message.message });
				break;
			default:
				throw new Error(`Invalid status result ${result.status}.`);
		}
	}

	async processLoginCallback() {
		const url = window.location.href;
		const result = await authService.completeSignIn(url);
		switch (result.status) {
			case AUTHENTICATION_RESULT_STATUS.REDIRECT:
				// There should not be any redirects as the only time completeSignIn finishes
				// is when we are doing a redirect sign in flow.
				throw new Error('Should not redirect.');
			case AUTHENTICATION_RESULT_STATUS.SUCCESS:
				await this.navigateToReturnUrl(this.getReturnUrl(result.state));
				break;
			case AUTHENTICATION_RESULT_STATUS.FAIL:
				this.setState({ message: result.message.message });
				break;
			default:
				throw new Error(
					`Invalid authentication result status '${result.status}'.`
				);
		}
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
			(state && state.returnUrl) || fromQuery || `${window.location.origin}/`
		);
	}

	redirectToProfile() {
		this.redirectToApiAuthorizationPath(APPLICATION_PATHS.IDENTITY_MANAGE);
	}

	redirectToApiAuthorizationPath(apiAuthorizationPath) {
		const REDIRECT_URL = `${window.location.origin}/${apiAuthorizationPath}`;
		// It's important that we do a replace here so that when the user hits the back arrow on the
		// browser they get sent back to where it was on the app instead of to an endpoint on this
		// component.
		window.location.replace(REDIRECT_URL);
	}

	navigateToReturnUrl(returnUrl) {
		// It's important that we do a replace here so that we remove the callback uri with the
		// fragment containing the tokens from the browser history.
		window.location.replace(returnUrl);
	}
}
