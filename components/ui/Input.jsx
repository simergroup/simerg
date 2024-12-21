const Input = ({ className = "", ...props }) => {
	return (
		<input
			className={`w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-300 placeholder-neutral-500 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600 ${className}`}
			{...props}
		/>
	);
};

export { Input };
