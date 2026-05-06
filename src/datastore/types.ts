import { ICustomType } from "../types/types.ts";
import { ManifestDatastoreSchema } from "../manifest/manifest_schema.ts";
import { SlackManifest } from "../manifest/mod.ts";
import { SlackPrimitiveTypes } from "../schema/slack/types/mod.ts";
import type { ValidSchemaTypes } from "../schema/schema_types.ts";
import type { ValidSlackPrimitiveTypes } from "../schema/slack/types/mod.ts";
import type { LooseStringAutocomplete } from "../type_utils.ts";

type InvalidDatastoreTypes =
  | typeof SlackPrimitiveTypes.blocks
  | typeof SlackPrimitiveTypes.oauth2;

type ValidDatastoreTypes = Exclude<
  | ValidSchemaTypes
  | ValidSlackPrimitiveTypes,
  InvalidDatastoreTypes
>;

export type SlackDatastoreAttribute = {
  // supports custom types, primitive types, inline objects and lists
  type: LooseStringAutocomplete<ValidDatastoreTypes> | ICustomType;
};

export type SlackDatastoreAttributes = Record<string, SlackDatastoreAttribute>;

export type SlackDatastoreDefinition<
  Name extends string,
  Attributes extends SlackDatastoreAttributes,
  PrimaryKey extends keyof Attributes,
  TimeToLiveAttribute extends keyof Attributes,
> = {
  name: Name;
  "primary_key": PrimaryKey;
  "time_to_live_attribute"?: TimeToLiveAttribute;
  attributes: Attributes;
};

export interface ISlackDatastore {
  name: string;
  export: () => ManifestDatastoreSchema;
  registerAttributeTypes: (manifest: SlackManifest) => void;
}

export type SlackDatastoreItem<Attributes extends SlackDatastoreAttributes> = {
  // TODO: In the future, see if we can map the attribute.type to
  // the TS type map like functions do w/ parameters
  // deno-lint-ignore no-explicit-any
  [k in keyof Attributes]: any;
};

export type PartialSlackDatastoreItem<
  Attributes extends SlackDatastoreAttributes,
> = OptionalPartial<Attributes>;

// deno-lint-ignore no-explicit-any
type OptionalPartial<T extends any> = {
  // deno-lint-ignore no-explicit-any
  [P in keyof T]?: any;
};
