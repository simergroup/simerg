const Card = ({ children, className = "", ...props }) => {
	return (
		<div
			className={`rounded-lg bg-neutral-700/30 text-neutral-200 shadow-sm ${className}`}
			{...props}
		>
			{children}
		</div>
	);
};

export { Card };
