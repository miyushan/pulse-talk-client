import { useFormContext, Controller } from "react-hook-form";
import { Input, InputProps } from "../ui/input";

interface RHFInputProps extends InputProps {
  name: string;
}

export const RHFInput = ({ name, ...props }: RHFInputProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Input {...field} errorMessage={error?.message} {...props} />
      )}
    />
  );
};
