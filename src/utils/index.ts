import { isNull, isUndefined } from "es-toolkit";

export const isNullable = <T>(v: T) => isNull(v) || isUndefined(v);
export const formToJson = (fd: FormData) => {
  const m = new Map();
  for (const [key, value] of fd.entries()) {
    m.set(key, value);
  }
  return Object.fromEntries(m.entries());
};
