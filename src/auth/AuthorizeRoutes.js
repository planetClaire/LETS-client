import React, { Component } from 'react';
import { Route } from 'react-router';

import { Login } from './Login';
import { Logout } from './Logout';
import { APPLICATION_PATHS, LOGIN_ACTIONS, LOGOUT_ACTIONS } from '../Constants';

export default class AuthorizationRoutes extends Component {
	render() {
		return (
			<>
				<Route
					path={APPLICATION_PATHS.LOGIN}
					render={() => loginAction(LOGIN_ACTIONS.LOGIN)}
				/>
				<Route
					path={APPLICATION_PATHS.LOGIN_FAILED}
					render={() => loginAction(LOGIN_ACTIONS.LOGIN_FAILED)}
				/>
				<Route
					path={APPLICATION_PATHS.LOGIN_CALLBACK}
					render={() => loginAction(LOGIN_ACTIONS.LOGIN_CALLBACK)}
				/>
				<Route
					path={APPLICATION_PATHS.PROFILE}
					render={() => loginAction(LOGIN_ACTIONS.PROFILE)}
				/>
				<Route
					path={APPLICATION_PATHS.LOGOUT}
					render={() => logoutAction(LOGOUT_ACTIONS.LOGOUT)}
				/>
				<Route
					path={APPLICATION_PATHS.LOGOUT_CALLBACK}
					render={() => logoutAction(LOGOUT_ACTIONS.LOGOUT_CALLBACK)}
				/>
				<Route
					path={APPLICATION_PATHS.LOGGED_OUT}
					render={() => logoutAction(LOGOUT_ACTIONS.LOGGED_OUT)}
				/>
			</>
		);
	}
}

function loginAction(name) {
	return <Login action={name}></Login>;
}

function logoutAction(name) {
	return <Logout action={name}></Logout>;
}
