"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { FIELD_NAMES } from "@/lib/helpers";

function Input({ type, ...props }: React.ComponentProps<"input">) {
  const [focused, setFocused] = React.useState<null | number>(null);
  return (
    <div className="relative p-[1px]">
      {focused === 0 && (
        <p className="absolute text-md -top-[11px] text-purple-600 z-999 left-4 font-boldd bg-white input-text--animated">
          {FIELD_NAMES[props.name as keyof typeof FIELD_NAMES]}
        </p>
      )}
      <input
        type={type}
        onFocus={() => setFocused(0)}
        placeholder={
          focused !== 0
            ? FIELD_NAMES[props.name as keyof typeof FIELD_NAMES]
            : ""
        }
        data-slot="input"
        className={cn(
          "text-lg p-2 pl-8 rounded-full bg-white dark:bg-gray-900 border border-transparent focus:outline-none w-full relative z-10"
        )}
        {...props}
      />
      <div className="absolute inset-0 rounded-full p-[2px] bg-gradient-to-r from-blue-400 via-purple-500 to-purple-700"></div>
    </div>
  );
}

export { Input };
