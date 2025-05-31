import { useState, type ChangeEvent,  } from 'react';
import { ChevronDown } from 'lucide-react'; // nếu dùng icon từ lucide

const SYMPTOMS = [
  'Đầy hơi', 'Ợ chua', 'Khó tiêu', 'Buồn nôn', 'Chướng bụng', 'Mệt mỏi', 'Chán ăn',
  'Đau đầu', 'Chóng mặt', 'Mất ngủ', 'Đau dạ dày nhẹ', 'Viêm họng', 'Ho khan',
  'Ngạt mũi', 'Khó thở nhẹ', 'Huyết áp thấp', 'Da xanh xao', 'Hạ đường huyết',
];

const SymptomSelect = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [showOptions, setShowOptions] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim() === '') {
      setFilteredOptions([]);
      setShowOptions(false);
    } else {
      const filtered = SYMPTOMS.filter((symptom) =>
        symptom.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOptions(filtered);
      setShowOptions(true);
    }
  };

  const handleSelectOption = (option: string) => {
    setInputValue(option);
    setShowOptions(false);
  };

  const handleBlur = () => {
    setTimeout(() => setShowOptions(false), 100);
  };

  return (
    <div className="relative">
      <input
        type="text"
        className="w-full border border-gray-300 rounded px-3 py-2 bg-blue-100"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={() => {
          if (inputValue.trim()) setShowOptions(true);
        }}
        placeholder="Nhập triệu chứng"
      />
      <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
      {showOptions && filteredOptions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-40 overflow-y-auto shadow-lg">
          {filteredOptions.map((option) => (
            <li
              key={option}
              className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
              onMouseDown={() => handleSelectOption(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SymptomSelect;
