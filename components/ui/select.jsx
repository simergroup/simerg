const Select = ({ value, onValueChange, children }) => {
	return <div className="relative">{children}</div>;
};

const SelectTrigger = ({ children }) => {
	return (
		<button
			type="button"
			className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-left focus:border-transparent focus:outline-none focus:ring-2 focus:ring-yellow-500"
		>
			{children}
		</button>
	);
};

const SelectContent = ({ children }) => {
	return (
		<div className="absolute z-10 mt-1 w-full rounded-md border border-neutral-300 bg-white shadow-lg">
			{children}
		</div>
	);
};

const SelectItem = ({ children, value, ...props }) => {
	return (
		<button
			type="button"
			className="w-full px-3 py-2 text-left hover:bg-neutral-100 focus:outline-none"
			{...props}
		>
			{children}
		</button>
	);
};

const SelectValue = ({ placeholder }) => {
	return <span className="block truncate">{placeholder}</span>;
};

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };
