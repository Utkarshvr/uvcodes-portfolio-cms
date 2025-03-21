import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/setup";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router";
import { ThemeProvider } from "@/components/theme-provider";
import { useState } from "react";
import { Loader } from "lucide-react";
import { FirebaseError } from "firebase/app";

const formSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().nonempty("Enter a password"),
});

export default function SignInPage() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  const [isSigningIn, setIsSigningIn] = useState(false);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSigningIn(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      console.log({ userCredential });
      toast(`Welcome back`);
      navigate("/");
    } catch (error) {
      const err = error as FirebaseError;
      toast(err?.message || `Error`);
      console.log(err);
    } finally {
      setIsSigningIn(false);
    }
  }

  const formArray: {
    name: "email" | "password";
    label: string;
    placeholder: string;
  }[] = [
    {
      name: "email",
      label: "Email",
      placeholder: "email@gmail.com",
    },
    {
      name: "password",
      label: "Password",
      placeholder: "****",
    },
  ];

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <main className="flex justify-center items-center min-h-svh">
        <div className="border p-4 rounded-md max-w-[400px] min-w-[400px]">
          <h1 className="text-2xl text-slate-700 dark:text-slate-300 font-semibold mb-6">
            Sign Up
          </h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {formArray.map((f) => (
                <FormField
                  key={f.name}
                  control={form.control}
                  name={f.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{f.label}</FormLabel>
                      <FormControl>
                        <Input type={f.name} placeholder={f.name} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button disabled={isSigningIn} className="w-full" type="submit">
                {isSigningIn ? <Loader /> : "Sign In"}
              </Button>
            </form>
          </Form>
        </div>
      </main>
      <Toaster />
    </ThemeProvider>
  );
}
