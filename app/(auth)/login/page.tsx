"use client";

import AuthForm from "@/components/AuthForm";
import { signInWithCredentials } from "@/lib/actions/auth";
import { signInSchema } from "@/lib/validations";

const Page = () => {
  return (
    <AuthForm
      schema={signInSchema}
      defaultValues={{
        email: "",
        password: "",
      }}
      type="SIGN_IN"
      onSubmit={signInWithCredentials}
    />
  );
};

export default Page;
