interface CountrySelectorProps {
    value: string;
    onChange: (value: string) => void;
}

export const CountrySelector = ({ value, onChange }: CountrySelectorProps) => {
    const countries = [
        { code: 'BOLIVIA', name: 'Bolivia', flag: '🇧🇴' },
        { code: 'PERU', name: 'Peru', flag: '🇵🇪' }
    ];

    return (
        <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-2">
                Country
            </label>
            <select
                id="country"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-3 bg-[#1a2332] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                required
            >
                {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                        {country.flag} {country.name}
                    </option>
                ))}
            </select>
        </div>
    );
};
