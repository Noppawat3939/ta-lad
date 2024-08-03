import axios from "axios";
import type { IDistrict, IProvince, ISubDistrict } from "@/types";

const THAI_PROVINCE_URL =
  "https://raw.githubusercontent.com/kongvut/thai-province-data/master";

export const getProvince = async () => {
  const { data } = await axios.get<IProvince[]>(
    `${THAI_PROVINCE_URL}/api_province.json`
  );

  return data;
};

export const getDistrict = async () => {
  const { data } = await axios.get<IDistrict[]>(
    `${THAI_PROVINCE_URL}/api_amphure.json`
  );

  return data;
};

export const getSubDistrict = async () => {
  const { data } = await axios.get<ISubDistrict[]>(
    `${THAI_PROVINCE_URL}/api_tambon.json`
  );

  return data;
};
