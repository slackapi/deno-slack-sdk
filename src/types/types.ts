import { TypedParameterDefinition } from "../parameters/types.ts";
import { SlackManifest } from "../manifest.ts";

export interface ICustomType {
  id: string;
  definition: TypedParameterDefinition;
  description?: string;
  registerParameterTypes: (manifest: SlackManifest) => void;
}
