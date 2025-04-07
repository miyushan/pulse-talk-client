"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { BASE_ROUTES } from "@/constants";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormProvider, RHFInput } from "@/components/hook-forms";
import { showToast } from "@/utils/showToast";

const registerFormSchema = z.object({
  firstName: z.string().min(2).max(30),
  lastName: z.string().min(2).max(30),
  userName: z.string().min(2).max(30),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
});
type RegisterFormSchema = z.infer<typeof registerFormSchema>;

const registerUserMutation = gql`
  mutation RegisterUser(
    $email: String!
    $firstName: String!
    $lastName: String
    $userName: String!
    $password: String!
  ) {
    registerUser(
      input: {
        email: $email
        firstName: $firstName
        lastName: $lastName
        password: $password
        userName: $userName
      }
    ) {
      message
      success
    }
  }
`;

export default function RegisterForm() {
  const router = useRouter();

  const methods = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const { handleSubmit } = methods;

  const [registerUser, { loading, error, data }] =
    useMutation(registerUserMutation);

  const callRegisterUser = async (values: RegisterFormSchema) => {
    const { firstName, lastName, userName, email, password, confirmPassword } =
      values;

    if (password !== confirmPassword) {
      showToast("error", "Passwords do not match.");
      return;
    }

    const res = await registerUser({
      variables: { email, firstName, lastName, userName, password },
    });

    if (res?.data?.registerUser.success) {
      showToast("success", "You have successfully registered.");
      router.push(BASE_ROUTES.SIGN_IN);
    }

    if (!res?.data?.registerUser.success && res?.data?.registerUser.message) {
      showToast("error", res?.data?.registerUser.message);
    }
  };

  const onSubmit = handleSubmit((values: RegisterFormSchema) => {
    callRegisterUser(values);
  });

  return (
    <div className={cn("max-w-xl mx-auto flex flex-col gap-6")}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider methods={methods} onSubmit={onSubmit}>
            <div className="flex flex-col gap-8 mt-2">
              <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                <RHFInput label="First name" name="firstName" />
                <RHFInput label="Last name" name="lastName" />
                <RHFInput label="Username" name="userName" />
                <RHFInput label="Email address" name="email" type="email" />
                <RHFInput label="Password" name="password" type="password" />
                <RHFInput
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                />
              </div>
              <Button
                size="default"
                type="submit"
                className="w-full"
                disabled={loading}
              >
                Create an account
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account{" "}
              <a
                className="underline underline-offset-4 cursor-pointer"
                onClick={() => router.push(BASE_ROUTES.SIGN_IN)}
              >
                Sign in
              </a>
            </div>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
