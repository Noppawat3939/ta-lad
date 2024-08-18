import { TDateFormat } from "./../types/shared.type";
import dayjs from "dayjs";
import pkg from "../../package.json";
import { TDate } from "@/types";

export const getVersion = () => pkg.version;

export const numberOnly = (value: string) => value.replace(/[^0-9]/g, "");

export const hasLowerCase = (text: string) => /[a-z]/.test(text);

export const hasUpperCase = (text: string) => /[A-Z]/.test(text);

export const hasNumber = (text: string) => /\d/.test(text);

export const delay = (ms = 300) => new Promise((rs) => setTimeout(rs, ms));

export const priceFormatter = (price = 0) =>
  price ? Intl.NumberFormat("th").format(price) : 0;

export const dateFormatter = (date?: TDate, format?: TDateFormat) =>
  date ? dayjs(date).format(format) : "";
