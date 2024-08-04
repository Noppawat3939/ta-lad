import { z } from "zod";

const firstSchema = z.object({
  email: z.string().email({ message: "กรุณากรอกอีเมลล์" }),
  password: z.string().min(1, { message: "กรุณากรอกรหัสผ่าน" }),
  phone_number: z.string().min(1, { message: "กรุณากรอกเบอร์โทรศัพท์" }),
});

const secondSchema = z.object({
  first_name: z.string().min(1, { message: "กรุณากรอกชื่อ" }).trim(),
  last_name: z.string().min(1, { message: "กรุณากรอกนามสกุล" }).trim(),
  id_card: z.string().min(1, { message: "กรุณากรอกเลขบัตรประชาชน" }),
  address_card_id: z
    .string()
    .min(1, { message: "กรุณากรอกที่อยู่ตามบัตรประชาชน" }),
  province: z.string().min(1, "กรุณาเลือกจังหวัด"),
  district: z.string().min(1, "กรุณาเลือกอำเภอ"),
  sub_district: z.string().min(1, "กรุณาเลือกเขต/ตำบล"),
});

export const registerAction = <
  TStep extends number,
  TValue extends Record<string, unknown>
>(
  curStep: TStep,
  values: TValue,
  done: (arg: z.SafeParseReturnType<TValue, {}>) => void
) => {
  const res = (curStep === 1 ? firstSchema : secondSchema).safeParse(
    Object.fromEntries(Object.entries(values))
  );

  if (res.success) return done(res);

  return res.error.formErrors.fieldErrors;
};
