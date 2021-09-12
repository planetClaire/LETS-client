import { XCircleIcon } from '@heroicons/react/solid';
import { useState } from 'react';

export default function Alert(props) {
	const [visible, setVisible] = useState(true);
	return (
		visible && (
			<div className="rounded-md bg-red-50 p-4 mb-2">
				<div className="flex">
					<div className="flex-shrink-0">
						<button onClick={() => setVisible(false)}>
							<XCircleIcon
								className="h-5 w-5 text-red-400"
								aria-hidden="true"
							/>
						</button>
					</div>
					<div className="ml-3 text-left">
						<p className="text-sm font-medium text-red-800 whitespace-pre ">
							{props.message}
						</p>
					</div>
				</div>
			</div>
		)
	);
}
