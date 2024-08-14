import axios from "axios";
import { getCookie, hasCookie } from "cookies-next";

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api`,
  timeout: 1000 * 30,
  headers: {
    locale: "th",
    ["api-key"]: process.env.NEXT_PUBLIC_PRIVATE_KEY,
    ...(hasCookie("session") && { Authorization: getCookie("session") }),
    ...(hasCookie("rdtk") && { ["api-key"]: getCookie("rdtk") }),
  },
});
