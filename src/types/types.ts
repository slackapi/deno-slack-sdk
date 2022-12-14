import { ParameterDefinition } from "../parameters/types.ts";
import { SlackManifest } from "../manifest/mod.ts";
import { ManifestCustomTypeSchema } from "../manifest/manifest_schema.ts";
import { CustomType } from "./mod.ts";

export type CustomTypeDefinition =
  & { name: string }
  & ParameterDefinition;

export type DefineTypeFunction = {
  <Def extends CustomTypeDefinition>(definition: Def): CustomType<Def>;
};

export interface ICustomType {
  id: string;
  definition: CustomTypeDefinition;
  description?: string;
  registerParameterTypes: (manifest: SlackManifest) => void;
  export(): ManifestCustomTypeSchema;
}
