import { z } from "zod";

const regexNumber = /^[0-9]+$/;

export const insertProductSchema = z.object({
  product_name: z.string().min(1, { message: "กรุณากรอกชื่อสินค้า" }),
  brand: z.string().min(1, { message: "กรุณากรอกแบรนด์" }),
  description: z.string().optional(),
  is_preorder: z.boolean().default(false).optional(),
  product_main_image: z.string().min(1, { message: "กรุณาอัพโหลดรูปภาพหลัก" }),
  product_images: z.string().array().optional().default([]),
  category_name: z.string().min(1, { message: "กรุณาเลือกหมวดหมู่สินค้า" }),
  price: z
    .string()
    .regex(regexNumber, { message: "กรอกเฉพาะตัวเลข" })
    .min(1, { message: "กรุณากรอกราคา" })
    .transform(Number),
  discount_price: z
    .string()
    .regex(regexNumber, { message: "กรอกเฉพาะตัวเลข" })
    .optional()
    .transform(Number),
  discount_start_date: z.string().optional(),
  discount_end_date: z.string().optional(),
  stock_amount: z
    .string()
    .min(1, { message: "กรุณากรอกจำนวนสต็อก" })
    .regex(regexNumber, { message: "กรอกเฉพาะตัวเลข" })
    .transform(Number),
  shipping_provider: z
    .string()
    .min(1, { message: "กรุณาเลือกผู้ให้บริการขนส่ง" }),
  shipping_fee: z
    .string()
    .min(1, { message: "กรุณากรอกค่าจัดส่ง" })
    .regex(regexNumber, { message: "กรอกเฉพาะตัวเลข" })
    .transform(Number),
  shipping_delivery_time: z
    .string()
    .min(1, { message: "กรุณาเลือกระยะเวลาจัดส่ง" })
    .transform(Number),
});
