import React from "react";

const Toggle = ({ validity, value, onChange }) => {
    return (
        <div
            onClick={() => onChange(!value)}
            className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer
        ${value ? "bg-blue-600" : "bg-gray-300"}`}
        >
            <div
                className={`w-5 h-5 bg-white rounded-full shadow transition-transform
          ${value ? "translate-x-7" : ""}`}
            >{value}</div>
        </div>
    );
};

export default Toggle