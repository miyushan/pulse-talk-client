import * as React from "react";

import { cn } from "@/lib/utils";
import { Label } from "./label";

export interface TextareaProps
  extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  description?: string;
  errorMessage?: string;
  fullWidth?: boolean;
  multiline?: boolean;
  classNames?: {
    root?: string;
    input?: string;
    description?: string;
    errorMessage?: string;
  };
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      type,
      label,
      description,
      fullWidth,
      errorMessage,
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
        <textarea
          className={cn(
            `flex min-h-[60px] w-full rounded-md border border-input bg-transparent 
            px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none 
            focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50`,
            { "focus-visible:ring-red-500 border-red-500": errorMessage },
            classNames?.input
          )}
          ref={ref}
          {...props}
        />
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
Textarea.displayName = "Textarea";

export { Textarea };
