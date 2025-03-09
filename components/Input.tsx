import React, { useState } from "react";

const Input = ({
  name,
  onChange,
  type,
}: {
  name: string;
  onChange: (e: string) => void;
  type: string;
}) => {
  const [focused, setFocused] = useState<null | number>(null);
  return (
    <div className="relative p-[1px]">
      {focused === 0 && (
        <p className="absolute text-md -top-[11px] text-purple-600 z-999 left-4 font-boldd bg-white input-text--animated">
          {name}
        </p>
      )}
      <input
        type={type}
        required
        onFocus={() => setFocused(0)}
        placeholder={focused !== 0 ? name : ""}
        onChange={(e) => onChange(e.target.value)}
        className="text-lg p-2 pl-8 rounded-full bg-white dark:bg-gray-900 border border-transparent focus:outline-none w-full relative z-10"
      />
      <div className="absolute inset-0 rounded-full p-[2px] bg-gradient-to-r from-blue-400 via-purple-500 to-purple-700"></div>
    </div>
  );
};

export default Input;
