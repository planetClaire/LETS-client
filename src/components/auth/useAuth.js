// adapted from https://usehooks.com/

import React, { useState, useEffect, useContext, createContext } from 'react';
import { initializeApp } from '@firebase/app';
import {
	getAuth,
	GoogleAuthProvider,
	signInWithPopup,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
} from 'firebase/auth';
import { FIREBASE_CONFIG } from '../../FirebaseConfig';

// Add your Firebase credentials
initializeApp(FIREBASE_CONFIG);
const authContext = createContext();
// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }) {
	const auth = useProvideAuth();
	return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}
// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
	return useContext(authContext);
};
// Provider hook that creates auth object and handles state
function useProvideAuth() {
	const [user, setUser] = useState(null);
	const auth = getAuth();
	const googleProvider = new GoogleAuthProvider();
	// Wrap any Firebase methods we want to use making sure ...
	// ... to save the user to state.
	const signin = (email, password) => {
		return signInWithEmailAndPassword(auth, email, password).then(
			(response) => {
				setUser(response.user);
				return response.user;
			}
		);
	};
	const signinWithGoogle = () => {
		signInWithPopup(auth, googleProvider)
			.then((response) => {
				// This gives you a Google Access Token. You can use it to access the Google API.
				// const credential =
				// 	GoogleAuthProvider.credentialFromResult(response);
				// const token = credential.accessToken;
				// The signed-in user info.
				// const user = response.user;
				setUser(response.user);
				// ...
				return response.user;
			})
			.catch((error) => {
				console.error(error);
				// Handle Errors here.
				// const errorCode = error.code;
				// const errorMessage = error.message;
				// // The email of the user's account used.
				// const email = error.email;
				// // The AuthCredential type that was used.
				// const credential = GoogleAuthProvider.credentialFromError(error);
				// ...
			});
	};
	const signup = (email, password) => {
		return createUserWithEmailAndPassword(auth, email, password).then(
			(response) => {
				setUser(response.user);
				return response.user;
			}
		);
	};
	const signout = () => {
		return signOut(auth).then(() => {
			setUser(false);
		});
	};
	const sendPasswordResetEmail = (email) => {
		return sendPasswordResetEmail(auth, email).then(() => {
			return true;
		});
	};
	const confirmPasswordReset = (code, password) => {
		return confirmPasswordReset(auth, code, password).then(() => {
			return true;
		});
	};
	// Subscribe to user on mount
	// Because this sets state in the callback it will cause any ...
	// ... component that utilizes this hook to re-render with the ...
	// ... latest auth object.
	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			if (user) {
				setUser(user);
			} else {
				setUser(false);
			}
		});
		// Cleanup subscription on unmount
		return () => unsubscribe();
	}, [auth]);
	// Return the user object and auth methods
	return {
		user,
		signin,
		signinWithGoogle,
		signup,
		signout,
		sendPasswordResetEmail,
		confirmPasswordReset,
	};
}