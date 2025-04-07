import { FormProvider as Form, UseFormReturn } from "react-hook-form";

interface FormProviderProps {
  children: React.ReactNode;
  methods: UseFormReturn<any>;
  onSubmit?: VoidFunction;
}

export const FormProvider = ({
  children,
  onSubmit,
  methods,
}: FormProviderProps) => {
  return (
    <Form {...methods}>
      <form onSubmit={onSubmit}>{children}</form>
    </Form>
  );
};
