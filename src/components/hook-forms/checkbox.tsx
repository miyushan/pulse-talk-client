import { useFormContext, Controller } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";
import { CheckboxProps } from "@radix-ui/react-checkbox";

interface RHFCheckboxProps extends CheckboxProps {
  name: string;
}

export const RHFCheckbox = ({ name, ...props }: RHFCheckboxProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Checkbox {...field} {...props} />
      )}
    />
  );
};
