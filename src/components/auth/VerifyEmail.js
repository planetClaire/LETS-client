import { MailIcon } from '@heroicons/react/solid';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import Header from '../Header';
import { useAuth } from './useAuth.js';
import Success from '../alerts/Success';

export default function VerifyEmail() {
	const auth = useAuth();
	const history = useHistory();
	const [message, setMessage] = useState();
	const [sent, setSent] = useState(false);

	if (!auth || !auth.user) {
		history.push('/login');
	}
	if (auth.user && auth.user.emailVerified) {
		history.push('/');
	}
	const handleClick = () => {
		auth.verifyEmail().then(() => {
			setMessage('Check your inbox!');
			setSent(true);
		});
	};
	return (
		<>
			<Header title="Verify your email address"></Header>
			<main>
				<div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
					<div className="px-4 py-8 sm:px-0">
						{message && <Success message={message} className="mb-4" />}
						<p className="mb-2">
							Your email address needs to be verified
						</p>
						<button
							disabled={sent}
							onClick={handleClick}
							type="button"
							className="disabled:opacity-50 disabled:cursor-text inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 my-2"
						>
							<MailIcon
								className="-ml-0.5 mr-2 h-4 w-4"
								aria-hidden="true"
							/>
							Get a verification email
						</button>
						{sent && (
							<button
								type="button"
								className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							>
								Check status
							</button>
						)}
					</div>
				</div>
			</main>
		</>
	);
}
