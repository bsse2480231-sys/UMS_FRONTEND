import { useState, useRef, useEffect } from 'react';

const SearchableSelect = ({ options, value, onChange, label, placeholder, error }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter options based on search term
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (opt) => {
    onChange(opt.value); // Send the ID back to the form
    setSearchTerm(opt.label); // Show the full label in the input
    setIsOpen(false);
  };

  // Keep input synced if the form is reset (e.g., opening create modal)
  useEffect(() => {
    const selectedOpt = options.find(opt => opt.value === value);
    if (selectedOpt) {
      setSearchTerm(selectedOpt.label);
    } else {
      setSearchTerm('');
    }
  }, [value, options]);

  return (
    <div ref={dropdownRef} className="relative">
      {label && <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>}
      <input 
        type="text"
        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 ${error ? 'border-red-400' : ''}`}
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => { 
          setSearchTerm(e.target.value); 
          setIsOpen(true); 
          onChange(''); // Clear the form value if user starts typing again
        }}
        onFocus={() => setIsOpen(true)}
      />
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-2 text-sm text-slate-400">No results found</div>
          ) : (
            filteredOptions.map((opt) => (
              <div 
                key={opt.value} 
                className="px-3 py-2 text-sm hover:bg-indigo-50 cursor-pointer transition-colors"
                onClick={() => handleSelect(opt)}
              >
                {opt.label}
              </div>
            ))
          )}
        </div>
      )}
      
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
};

export default SearchableSelect;