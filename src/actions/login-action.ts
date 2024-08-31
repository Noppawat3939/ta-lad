import { z } from "zod";
import { loginSchema } from "./schema";

export const loginAction = <TValue extends Record<string, unknown>>(
  values: TValue,
  done: (arg: z.SafeParseReturnType<TValue, {}>) => void
) => {
  const res = loginSchema.safeParse(Object.fromEntries(Object.entries(values)));

  if (res.success) return done(res);

  return res.error.formErrors.fieldErrors;
};
