import Header from '../components/Header';
import Main from '../components/Main';
import { TITLES } from '../Constants';

export default function Members() {
	return (
		<>
			<Header title={TITLES.MEMBERS}></Header>
			<Main>
				<p>Members page</p>
			</Main>
		</>
	);
}
