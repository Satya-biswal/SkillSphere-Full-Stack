const Loader = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-500 text-sm">{text}</p>
    </div>
  );
};

export default Loader;
