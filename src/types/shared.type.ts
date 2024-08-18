import { Dayjs } from "dayjs";

export type ServiceResponse<TData> = {
  success: boolean;
  message?: string | null;
} & { data?: TData };

export type TDate = Dayjs | number | string | Date | null;

export type TDateFormat = "YYYY-MM-DD" | "DD/MM/YYYY";
