import {
  CustomTypeParameterDefinition,
  TypedObjectParameterDefinition,
} from "../parameters/types.ts";
import { ManifestCustomEventSchema } from "../manifest/manifest_schema.ts";
import { CustomEvent } from "./mod.ts";
import { SlackManifest } from "../manifest/mod.ts";

type AcceptedEventTypes =
  | TypedObjectParameterDefinition
  | CustomTypeParameterDefinition;

export type CustomEventDefinition =
  & {
    /**
     * The name of your event
     * @example my_custom_event
     */
    name: string;
  }
  & AcceptedEventTypes;

export type DefineEventSignature = {
  <Def extends CustomEventDefinition>(definition: Def): CustomEvent<Def>;
};

export interface ICustomEvent {
  id: string;
  definition: CustomEventDefinition;
  description?: string;
  registerParameterTypes: (manifest: SlackManifest) => void;
  export(): ManifestCustomEventSchema;
}
