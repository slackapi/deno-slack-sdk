import CredentialSource from "./mod.ts";

export type CredentialSourceValues =
  typeof CredentialSource[keyof typeof CredentialSource];
