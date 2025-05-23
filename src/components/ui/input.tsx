import * as React from "react";

import { cn } from "@/lib/utils";
import { Label } from "./label";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  errorMessage?: string;
  fullWidth?: boolean;
  multiline?: boolean;
  endAdornment?: React.ReactNode;
  classNames?: {
    root?: string;
    inputContainer?: string;
    input?: string;
    description?: string;
    errorMessage?: string;
  };
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      description,
      fullWidth,
      errorMessage,
      endAdornment,
      classNames,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("space-y-1", { "w-full": fullWidth }, className)}>
        {label && (
          <Label className={cn(errorMessage && "text-destructive")}>
            {label}
          </Label>
        )}
        <div
          className={cn(
            `flex items-center w-full rounded-md border border-input bg-transparent overflow-hidden text-base
           placeholder:text-gray-400
           focus-within:outline-none focus-within:ring-1 focus-within:ring-ring focus-within:border-ring disabled:cursor-not-allowed disabled:opacity-50 `,
            {
              "focus-within:ring-red-500 border-red-500 focus-within:border-red-500":
                errorMessage,
            },
            classNames?.inputContainer
          )}
        >
          <input
            type={type}
            className={cn(
              `w-full focus-visible:outline-none px-3 min-h-10`,
              classNames?.input
            )}
            ref={ref}
            {...props}
          />
          {endAdornment && <div className="px-2">{endAdornment}</div>}
        </div>

        {description && (
          <p
            className={cn(
              "text-xs pl-1 text-muted-foreground",
              classNames?.description
            )}
          >
            {description}
          </p>
        )}
        {errorMessage && (
          <p
            className={cn(
              "text-xs pl-1 text-destructive",
              classNames?.errorMessage
            )}
          >
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
