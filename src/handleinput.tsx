import { useState, useEffect, type ChangeEvent } from 'react';
import { ChevronDown } from 'lucide-react';

interface DiseaseSelectProps {
  value?: string;
  onChange: (value: string) => void;
}

const DISEASES: string[] = [
  'Loét dạ dày',
  'Viêm dạ dày',
  'Trào ngược dạ dày thực quản',
  'Hội chứng ruột kích thích',
  'Viêm đại tràng',
  'Táo bón',
  'Tiêu chảy cấp',
  'Viêm gan B',
  'Viêm gan C',
  'Sỏi mật',
  'Suy gan',
  'Suy thận mạn',
  'Tiểu đường type 2',
];

const DiseaseSelect = ({ value = '', onChange }: DiseaseSelectProps) => {
  const [inputValue, setInputValue] = useState<string>(value);
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [showOptions, setShowOptions] = useState<boolean>(false);

  // Sync inputValue with value prop when it changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (newValue.trim() === '') {
      setFilteredOptions([]);
      setShowOptions(false);
    } else {
      const filtered = DISEASES.filter((disease) =>
        disease.toLowerCase().includes(newValue.toLowerCase())
      );
      setFilteredOptions(filtered);
      setShowOptions(true);
    }

    onChange(newValue);
  };

  const handleSelectOption = (option: string) => {
    setInputValue(option);
    setShowOptions(false);
    onChange(option);
  };

  const handleBlur = () => {
    setTimeout(() => setShowOptions(false), 100);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={() => {
          if (inputValue.trim()) setShowOptions(true);
        }}
        className="w-full border border-gray-300 rounded px-3 py-2 bg-blue-100"
        placeholder="Nhập tên bệnh..."
      />
      <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
      {showOptions && filteredOptions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-40 overflow-y-auto shadow-lg">
          {filteredOptions.map((option) => (
            <li
              key={option}
              onMouseDown={() => handleSelectOption(option)}
              className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DiseaseSelect;