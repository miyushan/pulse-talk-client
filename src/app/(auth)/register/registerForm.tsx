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
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { BASE_ROUTES } from "@/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormProvider, RHFInput } from "@/components/hook-forms";
import { showToast } from "@/lib/showToast";
import { registerFormSchema, RegisterFormSchema } from "./schema";
import { REGISTER_USER_MUTATION } from "@/graphql/mutations/registerUserMutation";
import { handleRegisterError } from "@/lib/auth";
import { capitalize } from "@/lib/capitalize";
import { useAppStore } from "@/store/appStore";
import { useEffect } from "react";

export default function RegisterForm() {
  const router = useRouter();
  const { resetUser, resetSelectedChatRoom } = useAppStore((state) => state);

  useEffect(() => {
    resetUser();
    resetSelectedChatRoom();
  }, [resetUser, resetSelectedChatRoom]);

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

  const [registerUser, { loading, error, data }] = useMutation(
    REGISTER_USER_MUTATION
  );

  const onSubmit = async (values: RegisterFormSchema) => {
    if (values.password !== values.confirmPassword)
      return showToast("error", "Passwords do not match.");

    try {
      const { data } = await registerUser({
        variables: {
          email: values.email,
          firstName: capitalize(values.firstName),
          lastName: capitalize(values.lastName),
          userName: capitalize(values.userName),
          password: values.password,
        },
      });

      if (data?.registerUser?.success) {
        showToast("success", "You have successfully registered.");
        router.push(BASE_ROUTES.SIGN_IN);
      }
    } catch (error) {
      showToast("error", handleRegisterError(error));
    }
  };

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
          <FormProvider
            methods={methods}
            onSubmit={methods.handleSubmit(onSubmit)}
          >
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
