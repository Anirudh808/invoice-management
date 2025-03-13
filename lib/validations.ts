import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(32),
  confirmPassword: z.string().min(8).max(32),
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(32),
});

export const addClient = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
});

export const addProject = z.object({
  title: z.string(),
  description: z.string(),
  dueDate: z.string(),
  clientId: z.number(),
});
