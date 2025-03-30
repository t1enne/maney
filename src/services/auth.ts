import { hash, verify } from "@node-rs/argon2";

export const AuthService = {
  hash: (password: string) =>
    hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    }),
  verify: (hash: string, password: string) => verify(hash, password),
};
