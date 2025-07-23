import { invariant, isNull, isUndefined } from "es-toolkit";
import { Context } from "hono";
import { getCookie } from "hono/cookie";
import { JwtPayload } from "../types/models/jwt-payload";
import { decode } from "hono/jwt";
import { attempt } from "es-toolkit";

export const isNullable = <T>(v: T) => isNull(v) || isUndefined(v);
export const formToJson = (fd: FormData) => {
  const m = new Map();
  for (const [key, value] of fd.entries()) {
    m.set(key, value);
  }
  return Object.fromEntries(m.entries());
};

export const withJwt = (c: Context) => {
  const cookie = getCookie(c, "jwt");
  invariant(cookie, "need cookie");
  const { payload } = decode(cookie);
  invariant(payload, "need cookie payload");
  const [error, jwt] = attempt(() => JwtPayload.parse(payload));
  invariant(!error, "need valid cookie payload");
  return jwt!;
};
