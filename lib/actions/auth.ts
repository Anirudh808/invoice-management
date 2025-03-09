/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { AuthCredentials } from "@/types";
import { db } from "./db";
import { hash } from "bcryptjs";
import { signIn } from "@/auth";

export const signInWithCredentials = async (
  params: Pick<AuthCredentials, "email" | "password">
) => {
  const { email, password } = params;

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, message: result.error };
    }

    return { success: true };
  } catch (error: any) {
    console.log(error, "Signin error");
    return { success: false, message: error.name };
  }
};

export const signUp = async (params: AuthCredentials) => {
  const { name, email, password, confirmPassword } = params;

  // const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  // const { success } = await ratelimit.limit(ip);

  // if (!success) redirect("/too-fast");

  if (password !== confirmPassword) {
    return { success: false, message: "passwords doesn't match" };
  }

  // Check if the user already exists.
  const existingUser = await db.user.findFirst({
    where: {
      email: email,
    },
  });

  if (existingUser) {
    return { success: false, message: "User already exists" };
  }

  const hashedPassword = await hash(password, 10);

  try {
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    await signInWithCredentials({ email, password });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Signup error." };
  }
};
