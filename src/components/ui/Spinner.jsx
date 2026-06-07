const Spinner = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-slate-500 text-sm font-medium">Loading...</p>
    </div>
  );
};

export default Spinner;