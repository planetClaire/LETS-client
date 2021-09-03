import { PuzzleIcon } from '@heroicons/react/outline';

export default function Logo(props) {
	/* Replace with your own logo */
	const size = props.size || '12';
	return (
		<PuzzleIcon
			className={`h-${size} w-${size} text-indigo-600 stroke-current mx-auto ${props.className}`}
		/>
	);
}
