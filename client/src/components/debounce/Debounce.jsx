import { useState, } from 'react';
import { useDebounce } from '../../hooks/useDebounce';

const Debounce = () => {
  const [inputValue, setInputValue] = useState('');
  const [displayValue, setDisplayValue] = useState('');

  const debouncedChangeHandler = useDebounce((value) => {
    setDisplayValue(value);
  }, 2000);

  const handleChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    debouncedChangeHandler(value);
  };

  return (
    <div>
      <input type="text" value={inputValue} onChange={handleChange} />
      <p>Debounced Value: {displayValue}</p>
    </div>
  );
};

export default Debounce;
