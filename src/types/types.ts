import { TypedParameterDefinition } from "../parameters/types.ts";
import { SlackManifest } from "../manifest.ts";
import { ManifestCustomTypeSchema } from "../types.ts";
import { CustomType } from "./mod.ts";

export type Test = string;
export type NameTypeDefinition =
  & { name: string }
  & TypedParameterDefinition;
export type CallbackTypeDefinition =
  & { callback_id: string }
  & TypedParameterDefinition;

export type CustomTypeDefinition = NameTypeDefinition | CallbackTypeDefinition;

export type DefineTypeFunction = {
  <Def extends NameTypeDefinition>(definition: Def): CustomType<Def>;
  /**
   * @deprecated Use name instead of callback_id
   */
  <Def extends CallbackTypeDefinition>(definition: Def): CustomType<Def>;
};

export interface ICustomType {
  id: string;
  definition: CustomTypeDefinition;
  description?: string;
  registerParameterTypes: (manifest: SlackManifest) => void;
  export(): ManifestCustomTypeSchema;
}
