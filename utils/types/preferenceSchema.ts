import { z } from "zod";
import { gender } from "../../constants/selection";

export const memberShipPreferenceSchema = z.object({
  preference: z.string().min(1).max(250),
});

export const preferenceSchema = z.object({
  gender: z.string().refine((value) => gender.some((g) => g.id === value), {
    message: "Invalid gender ID",
  }),
  race: z.string().min(1).max(20).optional(),
  age: z.number().min(1).max(100),
  distance: z.number().min(1).max(500),
});
