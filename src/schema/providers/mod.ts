import OAuth2Types from "./oauth2/mod.ts";
import JWTTypes from "./jwt/mod.ts";

const Schema = {
  oauth2: OAuth2Types,
  jwt: JWTTypes,
} as const;

export default Schema;
