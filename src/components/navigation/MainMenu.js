import { Fragment, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';

import { LETS_GROUP } from '../../Constants';
import Logo from '../Logo';
import useGravatar from '../auth/useGravatar';
import { AuthContext } from '../../App';

const navigation = [
	{ name: 'Home', href: '/', current: true },
	{ name: 'Members', href: '/members', current: false },
	{ name: 'Localities', href: '/localities', current: false },
];
const userNavigation = [
	{ name: 'Your Profile', href: '#' },
	{ name: 'Settings', href: '#' },
];

function classNames(...classes) {
	return classes.filter(Boolean).join(' ');
}

export default function MainMenu() {
	const auth = useContext(AuthContext);
	const gravatarImageUrl = useGravatar();

	return (
		<Disclosure as="nav" className="bg-white border-b border-gray-200">
			{({ open }) => (
				<>
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex justify-between h-16">
							<div className="flex">
								<div className="flex-shrink-0 flex items-center">
									<Link to="/">
										<Logo size="9" className="inline mr-2" />
										<span className="sr-only lg:not-sr-only font-bold">
											{LETS_GROUP.NAME}
										</span>
									</Link>
								</div>
								<div
									id="main-nav"
									className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8"
								>
									{navigation.map((item) => (
										<NavLink
											exact
											to={item.href}
											key={item.name}
											className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
										>
											{item.name}
										</NavLink>
									))}
								</div>
							</div>
							{auth.user && (
								<div className="hidden sm:ml-6 sm:flex sm:items-center">
									{/* Profile dropdown */}
									<Menu as="div" className="ml-3 relative">
										<div>
											<Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
												<span className="sr-only">
													Open user menu
												</span>
												<img
													className="h-8 w-8 rounded-full"
													src={
														auth.user.photoURL || gravatarImageUrl
													}
													alt={auth.user.displayName}
												/>
											</Menu.Button>
										</div>
										<Transition
											as={Fragment}
											enter="transition ease-out duration-200"
											enterFrom="transform opacity-0 scale-95"
											enterTo="transform opacity-100 scale-100"
											leave="transition ease-in duration-75"
											leaveFrom="transform opacity-100 scale-100"
											leaveTo="transform opacity-0 scale-95"
										>
											<Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
												{userNavigation.map((item) => (
													<Menu.Item key={item.name}>
														{({ active }) => (
															<a
																href={item.href}
																className={classNames(
																	active ? 'bg-gray-100' : '',
																	'block px-4 py-2 text-sm text-gray-700'
																)}
															>
																{item.name}
															</a>
														)}
													</Menu.Item>
												))}
												<button
													onClick={() => auth.signout()}
													className="block px-4 py-2 text-sm text-gray-700 w-full text-left hover:bg-gray-100"
													role="menuitem"
												>
													Logout
												</button>
											</Menu.Items>
										</Transition>
									</Menu>
								</div>
							)}
							<div className="-mr-2 flex items-center sm:hidden">
								{/* Mobile menu button */}
								<Disclosure.Button className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
									<span className="sr-only">Open main menu</span>
									{open ? (
										<XIcon
											className="block h-6 w-6"
											aria-hidden="true"
										/>
									) : (
										<MenuIcon
											className="block h-6 w-6"
											aria-hidden="true"
										/>
									)}
								</Disclosure.Button>
							</div>
						</div>
					</div>

					<Disclosure.Panel className="sm:hidden">
						{/* Mobile menu */}
						<div id="mobile-nav" className="pt-2 pb-3 space-y-1">
							{navigation.map((item) => (
								<Disclosure.Button
									as={NavLink}
									exact
									key={item.name}
									to={item.href}
									className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
								>
									{item.name}
								</Disclosure.Button>
							))}
						</div>
						<div className="pt-4 pb-3 border-t border-gray-200">
							<div className="flex items-center px-4">
								<div className="flex-shrink-0">
									<img
										className="h-10 w-10 rounded-full"
										src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
										alt=""
									/>
								</div>
								{/* <div className="ml-3">
									<div className="text-base font-medium text-gray-800">
										{user.name}
									</div>
									<div className="text-sm font-medium text-gray-500">
										{user.email}
									</div>
								</div> */}
							</div>
							<div className="mt-3 space-y-1">
								{userNavigation.map((item) => (
									<a
										key={item.name}
										href={item.href}
										className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
									>
										{item.name}
									</a>
								))}
							</div>
						</div>
					</Disclosure.Panel>
				</>
			)}
		</Disclosure>
	);
}
