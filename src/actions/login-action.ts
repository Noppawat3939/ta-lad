import { z } from "zod";

const schema = z.object({
  email: z.string().email({ message: "กรุณากรอกอีเมลล์" }),
  password: z.string().min(1, { message: "กรุณากรอกรหัสผ่าน" }),
});

export const loginAction = <TValue extends Record<string, unknown>>(
  values: TValue,
  done: (arg: z.SafeParseReturnType<TValue, {}>) => void
) => {
  const res = schema.safeParse(Object.fromEntries(Object.entries(values)));

  if (res.success) return done(res);

  return res.error.formErrors.fieldErrors;
};
