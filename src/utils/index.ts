import { isNull, isUndefined } from "@es-toolkit/es-toolkit";

export const isNullable = <T>(v: T) => isNull(v) || isUndefined(v);
