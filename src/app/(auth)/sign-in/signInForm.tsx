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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { BASE_ROUTES } from "@/constants";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormProvider, RHFInput } from "@/components/hook-forms";

const signInFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
type SignInFormSchema = z.infer<typeof signInFormSchema>;

const logInUserMutation = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(input: { email: $email, password: $password }) {
      message
      success
    }
  }
`;

export default function SignInForm() {
  const router = useRouter();

  const methods = useForm<SignInFormSchema>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { handleSubmit } = methods;

  const [loginUser, { loading, error, data }] = useMutation(logInUserMutation);

  const callLoginUser = async (values: SignInFormSchema) => {
    const { email, password } = values;
    const res = await loginUser({
      variables: { email, password },
    });

    if (res?.data?.loginUser.success) {
      router.push(BASE_ROUTES.CHAT);
    }
  };

  const onSubmit = handleSubmit((values: SignInFormSchema) => {
    callLoginUser(values);
  });

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider methods={methods} onSubmit={onSubmit}>
            <div className="flex flex-col gap-8 mt-2">
              <div className="flex flex-col space-y-4">
                <RHFInput
                  label="Your email address"
                  name="email"
                  type="email"
                />
                <RHFInput label="Password" name="password" type="password" />
              </div>
              <Button
                size="default"
                type="submit"
                className="w-full"
                disabled={loading}
              >
                Login
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
