import axios from "axios";

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api`,
  timeout: 1000 * 30,
  headers: {
    locale: "th",
  },
});
