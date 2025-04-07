import { z } from "zod";

export const registerFormSchema = z.object({
  firstName: z.string().min(2).max(30),
  lastName: z.string().min(2).max(30),
  userName: z.string().min(2).max(30),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
});
export type RegisterFormSchema = z.infer<typeof registerFormSchema>;
