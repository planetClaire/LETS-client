import { DotsHorizontalIcon } from '@heroicons/react/outline';

export default function Loading() {
	return (
		<DotsHorizontalIcon className="h-5 w-5 absolute mx-auto animate-spin text-gray-400 left-1/2 -translate-x-1/2 " />
	);
}
