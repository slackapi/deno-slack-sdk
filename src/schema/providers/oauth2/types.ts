import OAuth2ProviderTypes from "./mod.ts";

export type OAuth2ProviderTypeValues =
  typeof OAuth2ProviderTypes[keyof typeof OAuth2ProviderTypes];
