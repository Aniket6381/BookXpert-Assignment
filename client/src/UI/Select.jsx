import React from "react";

const Select = ({ label, options, error, ...props }) => {
    return (
        <div>
            <label className="block mb-1 text-gray-700">{label}</label>
            <select
                {...props}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 transition"
            >
                <option value="" className="capitalize">Select</option>
                {options.map(opt => (
                    <option key={opt} value={opt}>
                        {opt}
                    </option>
                ))}
            </select>
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    )
}

export default Select