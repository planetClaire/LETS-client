import Header from '../components/Header';
import useRequireAuth from '../components/auth/useRequireAuth';
import Loading from '../components/alerts/Loading';

export default function Members() {
	const auth = useRequireAuth();
	if (!auth) {
		return <Loading />;
	}
	return (
		<>
			<Header title="Members"></Header>
			<main>
				<div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
					{/* Replace with your content */}
					<div className="px-4 py-8 sm:px-0">
						<div className="border-4 border-dashed border-gray-200 rounded-lg h-96" />
					</div>
					{/* /End replace */}
				</div>
			</main>
		</>
	);
}
