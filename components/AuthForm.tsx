"use client";

import { ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FIELD_TYPES } from "@/lib/helpers";
import Loader from "./ui/loader";
import { Bounce, Slide, toast } from "react-toastify";

interface Props<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean; message?: string }>;
  type: "SIGN_IN" | "SIGN_UP";
}

const AuthForm = <T extends FieldValues>({
  type,
  schema,
  defaultValues,
  onSubmit,
}: Props<T>) => {
  const isSignIn = type === "SIGN_IN";
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handlesubmit: SubmitHandler<T> = async (data) => {
    setLoading(true);
    const result = await onSubmit(data);

    if (result.success) {
      setLoading(false);
      toast.success(
        isSignIn
          ? "You have successfully signed In"
          : "You have successfully signed up",
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        }
      );
      router.push("/");
    } else {
      setLoading(false);
      console.log(result);
      toast.error(
        result.message === "CredentialsSignin" && "Invalid Credentials",
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Slide,
        }
      );
    }
  };

  return (
    <div className="flex flex-col items-center p-4 pb-8">
      <div className="w-full flex justify-end">
        <div className="bg-[#AD46FF] p-1 rounded-full">
          <Image
            src={"/logo.svg"}
            alt="logo"
            width={60}
            height={60}
            className="rounded-full"
          />
        </div>
      </div>
      <div className="mt-4 text-center">
        <div>
          <h1 className="text-4xl font-semibold bg-linear-to-r from-blue-400 to-purple-700 via-purple-500 bg-clip-text text-transparent">
            {isSignIn ? "Welcome Back!" : "Create an Account"}
          </h1>
          <p className="text-sm text-gray-400 tracking-tight mt-3">
            {isSignIn ? (
              "Sign in to access your dashboard and manage your business with ease."
            ) : (
              <span>
                Join <strong className="text-purple-600">Invoyce</strong> and
                start managing your clients, projects, and invoices
                effortlessly.
              </span>
            )}
          </p>
        </div>
        <div className="w-full mt-8 flex flex-col items-center">
          <div className="w-3/4 text-gray-600">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handlesubmit)}
                className="space-y-8"
              >
                {Object.keys(defaultValues).map((field) => (
                  <FormField
                    key={field}
                    control={form.control}
                    name={field as Path<T>}
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormControl>
                          <Input
                            required
                            type={
                              FIELD_TYPES[
                                field.name as keyof typeof FIELD_TYPES
                              ]
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <Button
                  type="submit"
                  className="bg-linear-to-r from-blue-400 to-purple-700 via-purple-500 text-xl text-white rounded-full py-2 cursor-pointer hover:shadow-sm active:scale-99 focus:outline-purple-400 mt-2 w-full"
                >
                  {loading ? (
                    isSignIn ? (
                      <>
                        <Loader />
                        Signing In...
                      </>
                    ) : (
                      <>
                        <Loader />
                        Signing Up...
                      </>
                    )
                  ) : isSignIn ? (
                    "Sign In"
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </form>
            </Form>
          </div>
          <div className="flex justify-center gap-3 items-center mt-4">
            <p className="h-[1px] w-32 bg-gray-700"></p>
            <p>or</p>
            <p className="h-[1px] w-32 bg-gray-700"></p>
          </div>
          <div className="grid grid-cols-2 content-center gap-x-8 gap-y-4 mt-4">
            <button className="bg-amber-50">Google</button>
            <button className="bg-amber-50">Facebook</button>
            <button className="bg-amber-50">X</button>
            <button className="bg-amber-50">Linkedin</button>
          </div>
          <div></div>
          <p className="mt-4">
            {!isSignIn ? (
              <>
                Already have an account?{" "}
                <Link href={"/login"} className="text-purple-600 font-bold">
                  Sign in
                </Link>
              </>
            ) : (
              <>
                Don&apos;t have an account?{" "}
                <Link href={"/signup"} className="text-purple-600 font-bold">
                  Sign Up
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
