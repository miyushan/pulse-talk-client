import { useFormContext, Controller } from "react-hook-form";
import { Textarea, TextareaProps } from "../ui/textarea";

interface RHFTextareaProps extends TextareaProps {
  name: string;
}

export const RHFTextarea = ({ name, ...props }: RHFTextareaProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Textarea {...field} errorMessage={error?.message} {...props} />
      )}
    />
  );
};
