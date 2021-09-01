import React from 'react';
import { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { APPLICATION_PATHS, QUERY_PARAMETER_NAMES } from '../../Constants';
import authService from '../../AuthorizeService';
import Loading from '../alerts/Loading';

export default class AuthorizeRoute extends Component {
	constructor(props) {
		super(props);

		this.state = {
			ready: false,
			authenticated: false,
		};
	}

	componentDidMount() {
		this._subscription = authService.subscribe(() =>
			this.authenticationChanged()
		);
		this.populateAuthenticationState();
	}

	componentWillUnmount() {
		authService.unsubscribe(this._subscription);
	}

	render() {
		const { ready, authenticated } = this.state;
		let link = document.createElement('a');
		link.href = this.props.path;
		const RETURN_URL = `${link.protocol}//${link.host}${link.pathname}${link.search}${link.hash}`;
		const REDIRECT_URL = `${APPLICATION_PATHS.LOGIN}?${
			QUERY_PARAMETER_NAMES.RETURN_URL
		}=${encodeURIComponent(RETURN_URL)}`;
		if (!ready) {
			return <Loading />;
		} else {
			const { component: Component, ...rest } = this.props;
			return (
				<Route
					{...rest}
					render={(props) => {
						if (authenticated) {
							return <Component {...props} routeProps={this.props} />;
						} else {
							return <Redirect to={REDIRECT_URL} />;
						}
					}}
				/>
			);
		}
	}

	async populateAuthenticationState() {
		const authenticated = await authService.isAuthenticated();
		this.setState({ ready: true, authenticated });
	}

	async authenticationChanged() {
		this.setState({ ready: false, authenticated: false });
		await this.populateAuthenticationState();
	}
}
