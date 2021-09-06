import { MailIcon } from '@heroicons/react/solid';
import { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import Header from '../Header';
import { useAuth } from './useAuth.js';
import Success from '../alerts/Success';
import Alert from '../alerts/Error';

export default function VerifyEmail() {
	const auth = useAuth();
	const [message, setMessage] = useState();
	const [errorMessage, setErrorMessage] = useState();
	const [sent, setSent] = useState(false);
	const [user, setUser] = useState();

	useEffect(() => {
		if (auth.user !== undefined && auth.user !== null) {
			setUser(auth.user);
		}
	}, [auth]);

	const handleClick = () => {
		auth
			.verifyEmail(user)
			.then(
				() => {
					setMessage('Check your inbox!');
				},
				(errorCode) => {
					setErrorMessage(`Error: ${errorCode.replace('-', ' ')}`);
				}
			)
			.then(() => setSent(true));
	};

	return user === undefined ? null : user === false || user?.emailVerified ? (
		<Redirect to="/" />
	) : (
		<>
			<Header title="Verify your email address"></Header>
			<main>
				<div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
					<div className="px-4 py-8 sm:px-0">
						{message && <Success message={message} className="mb-4" />}
						{errorMessage && (
							<Alert message={errorMessage} className="mb-4" />
						)}
						<p className="mb-2">
							Your email address needs to be verified
						</p>
						<span className="relative z-0 inline-flex shadow-sm rounded-md my-2">
							<button
								disabled={sent}
								onClick={handleClick}
								type="button"
								className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-text "
							>
								<MailIcon
									className="-ml-0.5 mr-2 h-4 w-4"
									aria-hidden="true"
								/>
								Get a verification email
							</button>
						</span>
					</div>
				</div>
			</main>
		</>
	);
}
