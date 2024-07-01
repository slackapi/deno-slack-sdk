import JWTProviderTypes from "./mod.ts";

export type JWTProviderTypeValues =
  typeof JWTProviderTypes[keyof typeof JWTProviderTypes];
