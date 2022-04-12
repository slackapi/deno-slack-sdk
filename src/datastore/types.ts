import { ICustomType } from "../types/types.ts";
import { ManifestDatastoreSchema } from "../types.ts";

export type SlackDatastoreAttribute = {
  // supports custom types, primitive types, inline objects and lists
  type: string | ICustomType;
};

export type SlackDatastoreAttributes = Record<string, SlackDatastoreAttribute>;

export type SlackDatastoreDefinition<
  Attributes extends SlackDatastoreAttributes,
> = {
  name: string;
  "primary_key": keyof Attributes;
  attributes: Attributes;
};

export interface ISlackDatastore<Attributes extends SlackDatastoreAttributes> {
  name: string;
  export: () => ManifestDatastoreSchema;
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
