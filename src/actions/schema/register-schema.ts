import { z } from "zod";

export const firstSchema = z.object({
  email: z
    .string()
    .email({ message: "รูปแบบอีเมลล์ไม่ถูกต้อง" })
    .min(1, { message: "กรุณากรอกอีเมลล์" }),
  password: z.string().min(1, { message: "กรุณากรอกรหัสผ่าน" }),
  phone_number: z
    .string()
    .min(1, { message: "กรุณากรอกเบอร์โทรศัพท์" })
    .length(10, { message: "เบอร์โทรศัพท์ไม่ถูกต้อง" }),
});

export const secondSchema = z.object({
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

export const secondSellerSchema = secondSchema
  .omit({
    first_name: true,
    last_name: true,
  })
  .extend({
    store_name: z.string().min(1, { message: "กรุณากรอกชื่อร้านค้า" }).trim(),
  });
