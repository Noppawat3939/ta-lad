import { TDateFormat } from "./../types/shared.type";
import dayjs from "dayjs";
import pkg from "../../package.json";
import type { TDate } from "@/types";
import { RegexLowercase, RegexNumber, RegexUppercase } from ".";

export const getVersion = () => pkg.version;

export const numberOnly = (value: string) => value.replace(RegexNumber, "");

export const hasLowerCase = (text: string) => RegexLowercase.test(text);

export const hasUpperCase = (text: string) => RegexUppercase.test(text);

export const hasNumber = (text: string) => /\d/.test(text);

export const delay = (ms = 300) => new Promise((rs) => setTimeout(rs, ms));

export const priceFormatter = (price = 0, withCurrency = false) => {
  const formatted = price ? Intl.NumberFormat("th").format(price) : 0;

  return withCurrency ? `${formatted} THB` : formatted;
};

export const dateFormatter = (date?: TDate, format?: TDateFormat) =>
  date ? dayjs(date).format(format) : "";

export const parseCSV = <T extends object>(csvText: string) => {
  const rows = csvText.split(/\r?\n/);
  const headers = rows[0].split(",");

  let data = [];

  for (let i = 1; i < rows.length; i++) {
    const rowData = rows[i].split(",");
    const rowObject: Record<string, string> = {};

    for (let j = 0; j < headers.length; j++) {
      rowObject[headers[j]] = rowData[j];
    }
    data.push(rowObject);
  }
  return data as T;
};

export const isEmpty = (value: any) => {
  if (typeof value === "object") {
    return Array.isArray(value) ? isEmptyArray(value) : isEmptyObj(value);
  }

  return (
    ["", null, undefined].includes(value) ||
    !["function", "bigint", "boolean", "number"].some(
      (t) => typeof value === t && value !== 0
    )
  );
};

export const isEmptyObj = <O extends object>(obj: O) =>
  isEmptyArray(Object.keys(obj));

export const isEmptyArray = <A extends unknown[]>(a: A) => a.length === 0;

export const truncate = (text: string, len = 50) =>
  text.length > len ? text.slice(0, len) + "..." : text;
