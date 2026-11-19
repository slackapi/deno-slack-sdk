import type { SlackManifest } from "../manifest/mod.ts";
import type { ManifestDatastoreSchema } from "../manifest/manifest_schema.ts";
import type {
  ISlackDatastore,
  SlackDatastoreAttributes,
  SlackDatastoreDefinition,
} from "./types.ts";
import { isCustomType } from "../types/mod.ts";

/**
 * Define a datastore and primary key and attributes for use in a Slack application.
 * @param {SlackDatastoreDefinition<string, SlackDatastoreAttributes, string>} definition Defines information about your datastore.
 * @returns {SlackDatastore}
 */
export const DefineDatastore = <
  Name extends string,
  Attributes extends SlackDatastoreAttributes,
  PrimaryKey extends keyof Attributes,
  TimeToLiveAttribute extends keyof Attributes,
>(
  definition: SlackDatastoreDefinition<
    Name,
    Attributes,
    PrimaryKey,
    TimeToLiveAttribute
  >,
) => {
  return new SlackDatastore(definition);
};

export class SlackDatastore<
  Name extends string,
  Attributes extends SlackDatastoreAttributes,
  PrimaryKey extends keyof Attributes,
  TimeToLiveAttribute extends keyof Attributes,
> implements ISlackDatastore {
  public name: Name;

  constructor(
    public definition: SlackDatastoreDefinition<
      Name,
      Attributes,
      PrimaryKey,
      TimeToLiveAttribute
    >,
  ) {
    this.name = definition.name;
  }

  registerAttributeTypes(manifest: SlackManifest) {
    Object.values(this.definition.attributes).forEach((attribute) => {
      if (isCustomType(attribute.type)) {
        manifest.registerType(attribute.type);
      }
    });
  }

  export(): ManifestDatastoreSchema {
    return {
      primary_key: this.definition.primary_key as string,
      time_to_live_attribute: this.definition.time_to_live_attribute as string,
      attributes: this.definition.attributes,
    };
  }
}
