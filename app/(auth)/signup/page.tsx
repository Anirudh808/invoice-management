"use client";

import AuthForm from "@/components/AuthForm";
import { signUp } from "@/lib/actions/auth";
import { signUpSchema } from "@/lib/validations";

const Signup = () => {
  return (
    <AuthForm
      schema={signUpSchema}
      defaultValues={{
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      }}
      type="SIGN_UP"
      onSubmit={signUp}
    />
  );
};

export default Signup;
