import { z } from "zod";
import * as registerSchema from "./schema/register-schema";

export const registerAction = <
  TStep extends number,
  TValue extends Record<string, unknown>
>(
  curStep: TStep,
  values: TValue,
  done: (arg: z.SafeParseReturnType<TValue, {}>) => void
) => {
  const res = (
    curStep === 1 ? registerSchema.firstSchema : registerSchema.secondSchema
  ).safeParse(Object.fromEntries(Object.entries(values)));

  if (res.success) return done(res);

  return res.error.formErrors.fieldErrors;
};

export const sellerRegisterAction = <
  TStep extends number,
  TValue extends Record<string, unknown>
>(
  curStep: TStep,
  values: TValue,
  done: (arg: z.SafeParseReturnType<TValue, {}>) => void
) => {
  const res = (
    curStep === 1
      ? registerSchema.firstSchema
      : registerSchema.secondSellerSchema
  ).safeParse(Object.fromEntries(Object.entries(values)));

  if (res.success) return done(res);

  return res.error.formErrors.fieldErrors;
};
