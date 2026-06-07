import React from 'react';

const InputField = ({ label, icon: Icon, register, error, type = 'text', placeholder }) => {
  console.log(error)
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-slate-400" />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors bg-white ${
            error 
              ? 'border-red-400 focus:ring-red-300' 
              : 'border-slate-300 focus:ring-blue-300 focus:border-blue-400'
          }`}
          {...register}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
};

export default InputField;