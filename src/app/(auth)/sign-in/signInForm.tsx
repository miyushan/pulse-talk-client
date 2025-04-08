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
import { LOGIN_USER_MUTATION } from "@/graphql/mutations/loginUserMutation";
import { signInFormSchema, SignInFormSchema } from "./schema";
import { handleLoginError } from "@/lib/auth";
import usePersistStore from "@/hooks/usePersistStore";
import { useAppStore } from "@/store/appStore";

export default function SignInForm() {
  const router = useRouter();
  const store = usePersistStore(useAppStore, (state) => state);

  const methods = useForm<SignInFormSchema>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [loginUser, { loading, error, data }] =
    useMutation(LOGIN_USER_MUTATION);

  const onSubmit = async (values: SignInFormSchema) => {
    try {
      const { data } = await loginUser({ variables: values });
      console.log("🚀 ~ onSubmit ~ data:", data);

      if (data?.loginUser?.success && data.loginUser.user.id) {
        showToast("success", "You have successfully logged in.");
        console.log("🚀 ~ onSubmit ~ data2:", data);
        store?.selectUser(
          data.loginUser.user.id,
          data.loginUser.user.userName,
          data.loginUser.user.email
        );
        router.push(BASE_ROUTES.CHAT);
      }
    } catch (error) {
      showToast("error", handleLoginError(error));
    }
  };

  return (
    <div className={cn("max-w-md mx-auto flex flex-col gap-6")}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>
            Enter your email and password below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider
            methods={methods}
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-8 mt-2">
              <div className="flex flex-col space-y-4">
                <RHFInput label="Email address" name="email" type="email" />
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
              <a
                className="underline underline-offset-4 cursor-pointer"
                onClick={() => router.push(BASE_ROUTES.SIGN_UP)}
              >
                Sign up
              </a>
            </div>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
