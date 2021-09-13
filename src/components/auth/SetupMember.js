import { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import {
	useQuery,
	useLazyQuery,
	useMutation,
	useApolloClient,
} from '@apollo/client';
import { useForm } from 'react-hook-form';

import Header from '../Header';
import Main from '../Main';
import {
	GET_MEMBER,
	GET_LOCALITIES,
	ADD_MEMBER,
	GET_MEMBERS,
} from '../../graphql/fields';
import useGravatar from './useGravatar';
import { LETS_GROUP } from '../../Constants';
import Success from '../alerts/Success';
import Alert from '../alerts/Error';
import { formatErrors } from '../../Helpers';
import { AuthContext } from '../../App';

export default function SetupMember() {
	const [message, setMessage] = useState();
	const [errorMessage, setErrorMessage] = useState();
	const [user, setUser] = useState();
	const [email, setEmail] = useState();
	const [id, setId] = useState();
	const auth = useContext(AuthContext);
	const [gravatarImageUrl] = useGravatar();

	const client = useApolloClient();
	const [getMember, { data }] = useLazyQuery(GET_MEMBER);
	const { data: localitiesData } = useQuery(GET_LOCALITIES);
	const { register, handleSubmit, setValue } = useForm();

	useEffect(() => {
		if (auth.user !== undefined && auth.user !== null) {
			setUser(auth.user);
			setEmail(auth.user.email);
			setId(auth.user.uid);
			getMember({
				variables: { id: auth.user.uid },
			});
		}
	}, [auth, getMember, setValue]);

	const [addMember, { loading: addMemberLoading }] = useMutation(ADD_MEMBER, {
		update(cache, result) {
			const addMember = result.data.addMember;
			if (addMember && addMember.member) {
				const query = GET_MEMBERS;
				const data = client.readQuery({ query });
				client.writeQuery({
					query,
					data: {
						members: [
							...data.members,
							{
								...addMember.member,
								...{ members: [] },
							},
						],
					},
				});
			}
		},
	});

	const onSubmit = (data) => {
		console.log('data', data);
		addMember({
			variables: { member: data },
		}).then((e) => {
			const result = e.data.addMember;
			if (result) {
				if (result.member) {
					setMessage('Successfully created new member');
				} else if (result.userErrors) {
					setErrorMessage(formatErrors(result.userErrors));
				}
			}
		});
	};

	return user === undefined ? null : user === false ||
	  data?.member?.approved ? (
		<Redirect to="/" />
	) : (
		<>
			<Header title="Set up your membership"></Header>
			<Main>
				<form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
					<div className="space-y-6">
						{errorMessage && <Alert message={errorMessage} />}
						{message && <Success message={message} />}
						<div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
							<div className="md:grid md:grid-cols-3 md:gap-6">
								<div className="md:col-span-1">
									<h3 className="text-lg font-medium leading-6 text-gray-900">
										Profile
									</h3>
									<p className="mt-1 text-sm text-gray-500">
										This information will be displayed to other
										members.
									</p>
									<p className="mt-1 text-sm text-gray-500">
										Your registered email address is{' '}
										<strong>{email}</strong>
									</p>
									<h4 className="mt-10 text-md font-medium leading-6 text-gray-900">
										Country / Region
									</h4>
									<p className="mt-1 text-sm text-gray-500">
										{LETS_GROUP.NAME} is in{' '}
										<strong>{LETS_GROUP.STATE_PROVINCE}</strong>.
									</p>
								</div>
								<div className="mt-5 md:mt-0 md:col-span-2">
									<div className="grid grid-cols-6 gap-6">
										<input
											type="hidden"
											id="id"
											name="id"
											value={id}
											{...register('id')}
										/>
										<div className="col-span-6 sm:col-span-3">
											<label
												htmlFor="first-name"
												className="block text-sm font-medium text-gray-700"
											>
												First name
											</label>
											<input
												type="text"
												name="firstName"
												id="firstName"
												required
												autoComplete="given-name"
												className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
												{...register('firstName')}
											/>
										</div>
										<div className="col-span-6 sm:col-span-3">
											<label
												htmlFor="last-name"
												className="block text-sm font-medium text-gray-700"
											>
												Last name
											</label>
											<input
												type="text"
												name="lastName"
												id="lastName"
												required
												autoComplete="family-name"
												className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
												{...register('lastName')}
											/>
										</div>
										<div className="col-span-6 sm:col-span-2">
											<label
												htmlFor="phone"
												className="block text-sm font-medium text-gray-700"
											>
												Phone / mobile
											</label>
											<input
												type="tel"
												name="phone"
												id="phone"
												required
												autoComplete="tel-local"
												className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
												{...register('phone')}
											/>
										</div>
										<div className="col-span-6 sm:col-span-4">
											<label
												htmlFor="locality"
												className="block text-sm font-medium text-gray-700 "
											>
												Locality
											</label>
											<div className="mt-1 sm:col-span-2">
												<select
													id="locality"
													name="locality"
													defaultValue
													required
													{...register('localityId')}
													className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
												>
													<option value="">
														-- select your locality --
													</option>

													{localitiesData &&
														localitiesData.localities.map(
															(locality) => (
																<option
																	key={locality.uid}
																	value={locality.uid}
																>
																	{locality.name}{' '}
																	{locality.postcode}
																</option>
															)
														)}
												</select>
											</div>
										</div>{' '}
									</div>

									<div className="mt-5">
										<label className="block text-sm font-medium text-gray-700">
											Photo
										</label>
										<div className="mt-1 flex items-center space-x-5">
											<span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
												<img
													className="h-12 w-12 rounded-full"
													src={
														auth.user.photoURL || gravatarImageUrl
													}
													alt={auth.user.displayName}
												/>
											</span>
											<button
												type="button"
												className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
											>
												Change
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
							<div className="md:grid md:grid-cols-3 md:gap-6">
								<div className="md:col-span-1">
									<h3 className="text-lg font-medium leading-6 text-gray-900">
										Address Information
									</h3>
									<p className="mt-1 text-sm text-gray-500">
										For admin only, not shown to members.
									</p>
								</div>
								<div className="mt-5 md:mt-0 md:col-span-2">
									<div className="grid grid-cols-6 gap-6">
										<div className="col-span-6">
											<label
												htmlFor="street-address"
												className="block text-sm font-medium text-gray-700"
											>
												Street address
											</label>
											<input
												type="text"
												name="streetAddress"
												id="streetAddress"
												required
												autoComplete="street-address"
												className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
												{...register('streetAddress')}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="flex justify-end">
							<button
								type="submit"
								className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							>
								Submit for approval
							</button>
						</div>
					</div>
				</form>
			</Main>
		</>
	);
}
