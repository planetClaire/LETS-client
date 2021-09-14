import { MailIcon } from '@heroicons/react/solid';
import { useState, useEffect, useContext } from 'react';
import { Redirect } from 'react-router-dom';

import Header from '../Header';
import Main from '../Main';
import Success from '../alerts/Success';
import Alert from '../alerts/Error';
import { AuthContext } from '../../App';
import { TITLES } from '../../Constants';

export default function VerifyEmail() {
	const auth = useContext(AuthContext);
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
			<Header title={TITLES.VERIFY_EMAIL}></Header>
			<Main>
				{message && <Success message={message} className="mb-4" />}
				{errorMessage && <Alert message={errorMessage} className="mb-4" />}
				<p className="mb-2">Your email address needs to be verified</p>
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
			</Main>
		</>
	);
}
