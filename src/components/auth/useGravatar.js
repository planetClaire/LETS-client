import { useState, useEffect, useContext } from 'react';
import { md5 } from 'hash-wasm';
import { AuthContext } from '../../App';

export default function useGravatar() {
	const [imageUrl, setImageUrl] = useState();
	const auth = useContext(AuthContext);
	const gravatarUrl = 'https://www.gravatar.com/';

	useEffect(() => {
		if (auth && auth.user) {
			md5(auth.user.email.toLowerCase()).then((r) => {
				setImageUrl(`${gravatarUrl}avatar/${r}?d=mp`);
			});
		}
	}, [auth, setImageUrl]);

	return [imageUrl];
}
