import { XCircleIcon } from '@heroicons/react/solid';

export default function Alert(props) {
	return (
		<div className="rounded-md bg-red-50 p-4 mb-2">
			<div className="flex">
				<div className="flex-shrink-0">
					<XCircleIcon
						className="h-5 w-5 text-red-400"
						aria-hidden="true"
					/>
				</div>
				<div className="ml-3 text-left">
					<p className="text-sm font-medium text-red-800 whitespace-pre ">
						{props.message}
					</p>
				</div>
			</div>
		</div>
	);
}
