export default function Success(props) {
	return (
		<div
			className={`rounded-md bg-green-50  border border-green-100 p-4  ${props.className}`}
		>
			<div className="flex">
				<p className="text-sm font-medium text-green-800">
					{props.message}
				</p>
			</div>
		</div>
	);
}
