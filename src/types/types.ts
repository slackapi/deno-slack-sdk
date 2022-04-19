import { TypedParameterDefinition } from "../parameters/types.ts";
import { SlackManifest } from "../manifest.ts";

export type CustomTypeDefinition =
  & { callback_id: string }
  & TypedParameterDefinition;

export interface ICustomType {
  id: string;
  definition: CustomTypeDefinition;
  description?: string;
  registerParameterTypes: (manifest: SlackManifest) => void;
}
