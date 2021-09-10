import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/outline';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

import Header from '../Header';
import Main from '../Main';
import Loading from '../alerts/Loading';
import Success from '../alerts/Success';
import Alert from '../alerts/Error';
import {
	ADD_LOCALITY,
	DELETE_LOCALITY,
	GET_LOCALITIES,
	UPDATE_LOCALITY,
} from '../../graphql/fields';

export default function LocalitiesAdmin() {
	const [message, setMessage] = useState();
	const [errorMessage, setErrorMessage] = useState();
	const [open, setOpen] = useState(false);
	const [heading, setHeading] = useState();

	const { loading, data } = useQuery(GET_LOCALITIES);
	const client = useApolloClient();
	const { register, handleSubmit, reset } = useForm();

	const [addLocality, { loading: addLoading }] = useMutation(ADD_LOCALITY, {
		update(cache, result) {
			const addLocality = result.data.addLocality;
			if (addLocality && addLocality.locality) {
				const query = GET_LOCALITIES;
				const data = client.readQuery({ query });
				client.writeQuery({
					query,
					data: {
						localities: [
							...data.localities,
							{
								...addLocality.locality,
								...{ localities: [] },
							},
						],
					},
				});
			}
		},
	});

	const prepareEditForm = (id, name, postcode) => {
		reset({
			id: id,
			name: name,
			postcode: postcode,
		});
		setOpen(true);
	};

	const [updateLocality, { loading: updateLoading }] =
		useMutation(UPDATE_LOCALITY);

	const onSubmit = (data) => {
		if (!data.id) {
			data.id = uuidv4();
			addLocality({
				variables: { locality: data },
			}).then((e) => {
				const result = e.data.addLocality;
				if (result) {
					if (result.locality) {
						setMessage('Successfully created new locality');
					} else if (result.userErrors) {
						formatErrors(result.userErrors);
					}
				}
			});
		} else {
			updateLocality({
				variables: { locality: data },
			}).then((e) => {
				const result = e.data.updateLocality;
				if (result.locality) {
					setMessage('Successfully updated locality');
				} else if (result.userErrors) {
					formatErrors(result.userErrors);
				}
			});
		}
		setOpen(false);
		reset({});
	};

	const [deleteLocality, { loading: deleteLoading }] =
		useMutation(DELETE_LOCALITY);

	const handleDelete = (id) => {
		deleteLocality({
			variables: { id: id },
			update(cache, e) {
				if (e.data.deleteLocality && !e.data.deleteLocality.userErrors) {
					cache.modify({
						fields: {
							localities(existingLocalities = [], { readField }) {
								return existingLocalities.filter((localityRef) => {
									return id !== readField('uid', localityRef);
								});
							},
						},
					});
				}
			},
		}).then((e) => {
			const response = e.data.deleteLocality;
			if (response) {
				if (response.id === id) {
					setMessage('Successfully deleted locality');
				} else if (response.userErrors) {
					formatErrors(response.userErrors);
				}
			}
		});
	};

	const formatErrors = (errors) => {
		setErrorMessage(errors.map((e) => e.message).join('\n'));
	};

	if (loading || addLoading || updateLoading || deleteLoading)
		return <Loading />;

	return (
		<>
			<Header title="Localities Admin"></Header>
			<Main>
				<div className="flex flex-col">
					<div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
						<div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
							{message && <Success message={message} />}
							{errorMessage && <Alert message={errorMessage} />}
							<div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
								<table className="min-w-full divide-y divide-gray-200">
									<thead className="bg-gray-50">
										<tr>
											<th
												scope="col"
												className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
											>
												Name
											</th>
											<th
												scope="col"
												className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
											>
												Postcode
											</th>
											<th
												colSpan="2"
												className="py-3 text-right px-6"
											>
												<button
													type="button"
													className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
													onClick={() => {
														setOpen(true);
														reset({});
														setHeading('Add a new locality');
													}}
												>
													<PlusIcon
														className="-ml-0.5 mr-2 h-4 w-4"
														aria-hidden="true"
													/>
													Add new
												</button>
											</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										{data.localities?.map(
											({ uid: id, name, postcode }) => (
												<tr key={id}>
													<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
														{name}
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
														{postcode}
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
														<button
															className="text-indigo-600 hover:text-indigo-900"
															onClick={() =>
																prepareEditForm(
																	id,
																	name,
																	postcode
																)
															}
														>
															Edit
														</button>
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
														<button
															className="text-indigo-600 hover:text-indigo-900"
															onClick={() => handleDelete(id)}
														>
															Delete
														</button>
													</td>
												</tr>
											)
										)}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</Main>
			<Transition.Root show={open} as={Fragment}>
				<Dialog
					as="div"
					className="fixed z-10 inset-0 overflow-y-auto"
					onClose={setOpen}
				>
					<div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
						</Transition.Child>

						{/* This element is to trick the browser into centering the modal contents. */}
						<span
							className="hidden sm:inline-block sm:align-middle sm:h-screen"
							aria-hidden="true"
						>
							&#8203;
						</span>
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						>
							<div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
								<h3 className="my-6 text-center text-2xl font-bold text-gray-900">
									{heading}
								</h3>
								<form
									className="space-y-6"
									onSubmit={handleSubmit(onSubmit)}
								>
									<input
										type="hidden"
										id="id"
										name="id"
										{...register('id')}
									/>
									<div>
										<label
											htmlFor="name"
											className="block text-sm font-medium text-gray-700"
										>
											Name
										</label>
										<div className="mt-1">
											<input
												id="name"
												name="name"
												type="text"
												required
												className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
												{...register('name')}
											/>
										</div>
									</div>

									<div>
										<label
											htmlFor="postcode"
											className="block text-sm font-medium text-gray-700"
										>
											Postcode
										</label>
										<div className="mt-1">
											<input
												id="postcode"
												name="postcode"
												type="text"
												required
												className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
												{...register('postcode')}
											/>
										</div>
									</div>

									<div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
										<button
											type="submit"
											className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
										>
											Save
										</button>
										<button
											type="button"
											className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
											onClick={() => setOpen(false)}
										>
											Cancel
										</button>
									</div>
								</form>
							</div>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition.Root>
		</>
	);
}
