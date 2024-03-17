import { z } from "zod";
import { gender } from "../../constants/selection";

export const emailSchema = z.string().min(1, "Email is required").email("Invalid email address").trim();
export type emailType = z.infer<typeof emailSchema>;

export const UserDataSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required").max(50, "Password is too long"),
});

export const formSchema = z.object({
  username: z.string(),
  dob: z.date(),
  gender: z.string().refine((value) => gender.some((g) => g.id === value), {
    message: "Invalid gender ID",
  }),
  religion: z.string().min(3).max(20).optional(),
  zodiac: z.string().min(3).max(20).optional(),
  work: z.string().min(3).max(20).optional(),
  education: z.string().min(3).max(20).optional(),
  race: z.string().min(3).max(20).optional(),
  hobbies: z.array(z.string().min(1).max(20)).min(3),
  personalities: z.array(z.string().min(1).max(20)).min(3),
  mbti: z.string().length(4),
  introduction: z.string().max(500).optional(),
  avatar_url: z.string().optional(),
});

export const memberShipSchema = z.object({
  avatar_url: z.string().optional(),
  username: z.string(),
  dob: z.date(),
  gender: z.string().refine((value) => gender.some((g) => g.id === value), {
    message: "Invalid gender ID",
  }),
  prompt: z.string().min(1).max(250),
  preference: z.string().min(1).max(250),
});
