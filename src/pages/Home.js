import Header from '../components/Header';
import Main from '../components/Main';
import { TITLES } from '../Constants';

export default function Home() {
	return (
		<>
			<Header title={TITLES.HOME}></Header>
			<Main>
				<p>Home page</p>
			</Main>
		</>
	);
}
