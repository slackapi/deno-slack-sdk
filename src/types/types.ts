import { TypedParameterDefinition } from "../parameters/types.ts";
import { SlackManifest } from "../manifest.ts";
import { ManifestCustomTypeSchema } from "../types.ts";

export type NameTypeDefinition =
  & { name: string }
  & TypedParameterDefinition;
export type CallbackTypeDefinition =
  & { callback_id: string }
  & TypedParameterDefinition;

export interface ICustomType {
  id: string;
  definition: CallbackTypeDefinition | NameTypeDefinition;
  description?: string;
  registerParameterTypes: (manifest: SlackManifest) => void;
  export(): ManifestCustomTypeSchema;
}
