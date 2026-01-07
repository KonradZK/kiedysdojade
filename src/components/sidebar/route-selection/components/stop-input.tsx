import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface StopInputProps {
  id: string;
  placeholder: string;
  value: string;
  disabled?: boolean;
  showRemoveButton?: boolean;
  onChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onRemove?: () => void;
}

export const StopInput = forwardRef<HTMLInputElement, StopInputProps>(
  (
    {
      id,
      placeholder,
      value,
      disabled = false,
      showRemoveButton = false,
      onChange,
      onFocus,
      onBlur,
      onKeyDown,
      onRemove,
    },
    ref
  ) => {
    return (
      <div className="flex flex-col gap-2 relative">
        <Input
          id={id}
          ref={ref}
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          className={`bg-secondary dark:bg-secondary focus-visible:h-12 transition-all duration-500 ease-in-out font-medium focus-visible:text-xl ${
            showRemoveButton ? "pr-10" : ""
          }`}
        />
        {showRemoveButton && (
          <Button
            variant="ghost"
            size="icon"
            disabled={disabled}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={onRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }
);

StopInput.displayName = "StopInput";
