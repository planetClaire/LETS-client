import { UserManager } from 'oidc-client';

import { AUTHENTICATION_RESULT_STATUS, CONFIG, IDENTITY } from './Constants';

export class AuthorizeService {
	_callbacks = [];
	_nextSubscriptionId = 0;
	_user = null;
	_isAuthenticated = false;

	async isAuthenticated() {
		const user = await this.getUser();
		return !!user;
	}

	async getUser() {
		if (this._user && this._user.profile) {
			return this._user.profile;
		}

		await this.ensureUserManagerInitialized();
		const user = await this.userManager.getUser();
		return user && user.profile;
	}

	async getAccessToken() {
		await this.ensureUserManagerInitialized();
		const user = await this.userManager.getUser();
		return user && user.access_token;
	}

	// We try to authenticate the user in two different ways:
	// 1) We try to see if we can authenticate the user silently. This happens
	//    when the user is already logged in on the IdP and is done using a hidden iframe
	//    on the client.
	// 2) If the method above fails, we redirect the browser to the IdP to perform a traditional
	//    redirect flow.
	async signIn(state) {
		await this.ensureUserManagerInitialized();
		try {
			const silentUser = await this.userManager.signinSilent(
				this.createArguments()
			);
			this.updateState(silentUser);
			return this.success(state);
		} catch (silentError) {
			// User might not be authenticated, fallback to redirect
			console.log('Silent authentication error: ', silentError);

			try {
				await this.userManager.signinRedirect(this.createArguments(state));
				return this.redirect();
			} catch (redirectError) {
				console.log('Redirect authentication error: ', redirectError);
				return this.error(redirectError);
			}
		}
	}

	async completeSignIn(url) {
		try {
			await this.ensureUserManagerInitialized();
			const user = await this.userManager.signinCallback(url);
			this.updateState(user);
			return this.success(user && user.state);
		} catch (error) {
			console.log('There was an error signing in: ', error);
			return this.error('There was an error signing in.');
		}
	}

	// Redirect the browser to the IdP to perform a traditional post logout redirect flow.
	async signOut(state) {
		await this.ensureUserManagerInitialized();
		try {
			await this.userManager.signoutRedirect(this.createArguments(state));
			return this.redirect();
		} catch (redirectSignOutError) {
			console.log('Redirect signout error: ', redirectSignOutError);
			return this.error(redirectSignOutError);
		}
	}

	async completeSignOut(url) {
		await this.ensureUserManagerInitialized();
		try {
			const response = await this.userManager.signoutCallback(url);
			this.updateState(null);
			return this.success(response && response.data);
		} catch (error) {
			console.log(`There was an error trying to log out '${error}'.`);
			return this.error(error);
		}
	}

	updateState(user) {
		this._user = user;
		this._isAuthenticated = !!this._user;
		this.notifySubscribers();
	}

	subscribe(callback) {
		this._callbacks.push({
			callback,
			subscription: this._nextSubscriptionId++,
		});
		return this._nextSubscriptionId - 1;
	}

	unsubscribe(subscriptionId) {
		const subscriptionIndex = this._callbacks
			.map((element, index) =>
				element.subscription === subscriptionId
					? { found: true, index }
					: { found: false }
			)
			.filter((element) => element.found === true);
		if (subscriptionIndex.length !== 1) {
			throw new Error(
				`Found an invalid number of subscriptions ${subscriptionIndex.length}`
			);
		}

		this._callbacks.splice(subscriptionIndex[0].index, 1);
	}

	notifySubscribers() {
		for (let i = 0; i < this._callbacks.length; i++) {
			const callback = this._callbacks[i].callback;
			callback();
		}
	}

	createArguments(state) {
		return { useReplaceToNavigate: true, data: state };
	}

	error(message) {
		return { status: AUTHENTICATION_RESULT_STATUS.FAIL, message };
	}

	success(state) {
		return { status: AUTHENTICATION_RESULT_STATUS.SUCCESS, state };
	}

	redirect() {
		return { status: AUTHENTICATION_RESULT_STATUS.REDIRECT };
	}

	async ensureUserManagerInitialized() {
		if (this.userManager !== undefined) {
			return;
		}

		let config = {
			authority: CONFIG.IDENTITY_URL,
			client_id: IDENTITY.CLIENT_ID,
			redirect_uri: IDENTITY.REDIRECT_URI,
			response_type: 'code', // authorization code flow with PKCE
			scope: IDENTITY.SCOPE,
			post_logout_redirect_uri: IDENTITY.POST_LOGOUT_REDIRECT_URI,
		};

		this.userManager = new UserManager(config);

		this.userManager.events.addUserSignedOut(async () => {
			await this.userManager.removeUser();
			this.updateState(undefined);
		});
	}

	static get instance() {
		return authService;
	}
}

const authService = new AuthorizeService();

export default authService;
