import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { LETS_GROUP } from '../../Constants';
import Logo from '../Logo';
import { ReactComponent as GoogleLogo } from '../../images/Google__G__Logo.svg';
import Success from '../alerts/Success';
import Alert from '../alerts/Error';
import { AuthContext } from '../../App';

export default function Register() {
	const auth = useContext(AuthContext);
	const [message, setMessage] = useState();
	const [errorMessage, setErrorMessage] = useState();
	const { register, handleSubmit } = useForm();
	const onSubmit = (data) =>
		auth.signup(data.email, data.password).then(
			() => {
				setMessage('Please check your email for a verification link');
			},
			(errorCode) => {
				setErrorMessage(`Error: ${errorCode.replace('-', ' ')}`);
			}
		);
	return (
		<div className="flex flex-col justify-center ">
			{message && <Success message={message} />}
			{errorMessage && <Alert message={errorMessage} />}
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<Logo />
				<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
					Register
				</h2>
				<p className="mt-2 text-center text-sm text-gray-600">
					Become a member of {LETS_GROUP.NAME}
				</p>
			</div>

			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
					<form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700"
							>
								Email address
							</label>
							<div className="mt-1">
								<input
									id="email"
									name="email"
									type="email"
									autoComplete="email"
									required
									className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
									{...register('email')}
								/>
							</div>
						</div>

						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700"
							>
								Password
							</label>
							<div className="mt-1">
								<input
									id="password"
									name="password"
									type="password"
									autoComplete="current-password"
									required
									className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
									{...register('password')}
								/>
							</div>
						</div>

						<div className="flex items-center justify-between">
							<div className="text-sm">
								<Link
									to="/login"
									className="font-medium text-indigo-600 hover:text-indigo-500"
								>
									Already a member? Login
								</Link>
							</div>
						</div>

						<div>
							<button
								type="submit"
								className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							>
								Get started
							</button>
						</div>
					</form>

					<div className="mt-6">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 bg-white text-gray-500">
									Or continue with
								</span>
							</div>
						</div>

						<div className="mt-6 grid grid-cols-3 gap-3">
							<div>
								<button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
									<span className="sr-only">
										Sign in with Facebook
									</span>
									<svg
										className="w-5 h-5"
										aria-hidden="true"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
											clipRule="evenodd"
										/>
									</svg>
								</button>
							</div>

							<div>
								<button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
									<span className="sr-only">Sign in with Twitter</span>
									<svg
										className="w-5 h-5"
										aria-hidden="true"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
									</svg>
								</button>
							</div>

							<div>
								<button
									className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
									onClick={() => auth.signinWithGoogle()}
									title="Sign in with Google"
								>
									<GoogleLogo />
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
