import { InputHTMLAttributes, useState } from 'react';

interface CountryCode {
  code: string;
  country: string;
  flag: string;
}

const countryCodes: CountryCode[] = [
  { code: '+591', country: 'Bolivia', flag: '🇧🇴' },
  { code: '+51', country: 'Perú', flag: '🇵🇪' },
];

interface PhoneInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  label: string;
  value: string;
  onChange: (fullNumber: string) => void;
}

export function PhoneInput({ label, id, className = '', value, onChange, ...props }: PhoneInputProps) {
  // Parse existing value to extract country code and number
  const getInitialCountryCode = () => {
    for (const cc of countryCodes) {
      if (value.startsWith(cc.code)) {
        return cc.code;
      }
    }
    return countryCodes[0].code;
  };

  const getInitialNumber = () => {
    for (const cc of countryCodes) {
      if (value.startsWith(cc.code)) {
        return value.slice(cc.code.length).trim();
      }
    }
    return value;
  };

  const [countryCode, setCountryCode] = useState(getInitialCountryCode());
  const [phoneNumber, setPhoneNumber] = useState(getInitialNumber());

  const handleCountryCodeChange = (newCode: string) => {
    setCountryCode(newCode);
    if (phoneNumber) {
      onChange(`${newCode} ${phoneNumber}`);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = e.target.value;
    setPhoneNumber(newNumber);
    if (newNumber) {
      onChange(`${countryCode} ${newNumber}`);
    } else {
      onChange('');
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-sm text-gray-400 font-medium"
      >
        {label}
      </label>
      <div className="flex gap-2">
        <select
          value={countryCode}
          onChange={(e) => handleCountryCodeChange(e.target.value)}
          className={`
            bg-[#0a1929]
            border border-gray-700
            rounded-lg
            px-3 py-3
            text-gray-300
            focus:outline-none
            focus:ring-2
            focus:ring-cyan-500
            focus:border-transparent
            transition-all
            cursor-pointer
            min-w-[120px]
          `}
          disabled={props.disabled}
        >
          {countryCodes.map((cc) => (
            <option key={cc.code} value={cc.code}>
              {cc.flag} {cc.code}
            </option>
          ))}
        </select>
        <input
          id={id}
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          className={`
            bg-[#0a1929]
            border border-gray-700
            rounded-lg
            px-4 py-3
            text-gray-300
            placeholder-gray-600
            focus:outline-none
            focus:ring-2
            focus:ring-cyan-500
            focus:border-transparent
            transition-all
            flex-1
            ${className}
          `}
          {...props}
        />
      </div>
    </div>
  );
}
