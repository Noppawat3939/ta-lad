import pkg from "../../package.json";

export const getVersion = () => pkg.version;

export const numberOnly = (value: string) => value.replace(/[^0-9]/g, "");

export const hasLowerCase = (text: string) => /[a-z]/.test(text);

export const hasUpperCase = (text: string) => /[A-Z]/.test(text);

export const hasNumber = (text: string) => /\d/.test(text);
