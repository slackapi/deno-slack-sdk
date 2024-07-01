import { JWTProviderTypeValues } from "../../schema/providers/jwt/types.ts";

export type JWTProviderOptions = {
  header: { [key: string]: string | string[] };
  payload: { [key: string]: string | string[] };
  secret: string;
};

export type JWTProviderDefinitionArgs = {
  provider_key: string;
  provider_type: JWTProviderTypeValues;
  options: JWTProviderOptions;
};
