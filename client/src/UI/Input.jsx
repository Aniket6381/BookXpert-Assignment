import React from "react";

const Input = ({ label, error, ...props }) => {
    return (
        <div>
            <div className="flex gap-1">
                <label className="block mb-1 text-gray-700">{label}</label>
                {error !== "" && <span className="text-red-500 mt-0.5">*</span>}
            </div>
            <input
                {...props}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 transition"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    )
}

export default Input