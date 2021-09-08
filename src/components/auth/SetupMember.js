import { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';

import Header from '../Header';
import Main from '../Main';
import { useAuth } from './useAuth.js';
import Success from '../alerts/Success';
import Alert from '../alerts/Error';
import { GET_MEMBER } from '../../graphql/fields';
import useGravatar from './useGravatar';

export default function SetupMember() {
	const auth = useAuth();
	const [message, setMessage] = useState();
	const [errorMessage, setErrorMessage] = useState();
	const [user, setUser] = useState();
	const [gravatarImageUrl] = useGravatar();

	const [getMember, { loading, error, data }] = useLazyQuery(GET_MEMBER);

	useEffect(() => {
		if (auth.user !== undefined && auth.user !== null) {
			setUser(auth.user);
			getMember({
				variables: { id: auth.user.uid },
			});
		}
	}, [auth, getMember]);

	return user === undefined ? null : user === false ||
	  data?.member?.approved ? (
		<Redirect to="/" />
	) : (
		<>
			<Header title="Set up your membership"></Header>
			<Main>Hello world</Main>
		</>
	);
}
