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

export default function SignInForm() {
  const router = useRouter();

  const logInUserMutation = gql`
    mutation LoginUser($email: String!, $password: String!) {
      loginUser(input: { email: $email, password: $password }) {
        message
        success
      }
    }
  `;

  const [loginUser, { loading, error, data }] = useMutation(logInUserMutation);

  if (data?.loginUser?.success) {
    router.push(`${BASE_ROUTES.CHAT}`);
  }

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
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  //   required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  // required
                />
              </div>
              <Button
                type="button"
                disabled={loading}
                className="w-full"
                onClick={(e) => {
                  e.preventDefault();
                  const email = "kumar@gmail";
                  const password = "kumar";
                  loginUser({
                    variables: { email, password },
                  });
                }}
              >
                Login
              </Button>
              <Button variant="outline" className="w-full">
                Login with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
