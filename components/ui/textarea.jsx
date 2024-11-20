const Textarea = ({ className = '', ...props }) => {
  return (
    <textarea
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent min-h-[100px] ${className}`}
      {...props}
    />
  );
};

export { Textarea };
