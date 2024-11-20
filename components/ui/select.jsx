const Select = ({ value, onValueChange, children }) => {
  return (
    <div className="relative">
      {children}
    </div>
  );
};

const SelectTrigger = ({ children }) => {
  return (
    <button
      type="button"
      className="w-full px-3 py-2 text-left border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white"
    >
      {children}
    </button>
  );
};

const SelectContent = ({ children }) => {
  return (
    <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
      {children}
    </div>
  );
};

const SelectItem = ({ children, value, ...props }) => {
  return (
    <button
      type="button"
      className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:outline-none"
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
