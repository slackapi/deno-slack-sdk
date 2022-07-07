import { TypedParameterDefinition } from "../parameters/types.ts";
import { SlackManifest } from "../manifest.ts";
import { ManifestCustomTypeSchema } from "../types.ts";

export type CustomTypeDefinition =
  | (
    & {
      /**
       * @deprecated Use name instead
       */
      callback_id: string;
    }
    & TypedParameterDefinition
  )
  | (
    & { name: string }
    & TypedParameterDefinition
  );

export interface ICustomType {
  id: string;
  definition: CustomTypeDefinition;
  description?: string;
  registerParameterTypes: (manifest: SlackManifest) => void;
  export(): ManifestCustomTypeSchema;
}
