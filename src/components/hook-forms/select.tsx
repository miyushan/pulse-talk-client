import { useFormContext, Controller } from "react-hook-form";
import { Select } from "../ui/select";
import { ReactNode } from "react";

interface RHFSelectProps {
  name: string;
  children: ReactNode;
}

export const RHFSelect = ({ name, children }: RHFSelectProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select {...field} onValueChange={field.onChange}>
          {children}
        </Select>
      )}
    />
  );
};
