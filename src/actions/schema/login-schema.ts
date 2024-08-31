import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "กรุณากรอกอีเมลล์" }),
  password: z.string().min(1, { message: "กรุณากรอกรหัสผ่าน" }),
});
