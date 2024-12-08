const Button = ({ children, type = "button", variant = "primary", ...props }) => {
	const baseClasses = "px-4 py-2 rounded-md font-medium transition-colors";
	const variants = {
		primary: "bg-yellow-600 text-white hover:bg-yellow-700",
		outline: "border border-neutral-300 text-neutral-700 hover:bg-neutral-50",
		destructive: "bg-red-600 text-white hover:bg-red-700",
	};

	return (
		<button type={type} className={`${baseClasses} ${variants[variant]}`} {...props}>
			{children}
		</button>
	);
};

export { Button };
