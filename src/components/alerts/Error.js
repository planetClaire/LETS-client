import { XCircleIcon } from '@heroicons/react/solid';

export default function Alert(props) {
	return (
		<div className="rounded-md bg-red-50 p-4">
			<div className="flex">
				<div className="flex-shrink-0">
					<XCircleIcon
						className="h-5 w-5 text-red-400"
						aria-hidden="true"
					/>
				</div>
				<div className="ml-3 text-left">
					<h3 className="text-sm font-medium text-red-800">
						{props.message}
					</h3>
				</div>
			</div>
		</div>
	);
}
