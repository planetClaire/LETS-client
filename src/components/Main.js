export default function Main(props) {
	return (
		<main>
			<div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
				<div className="px-4 py-8 sm:px-0">{props.children}</div>
			</div>
		</main>
	);
}
