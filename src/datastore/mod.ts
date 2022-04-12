import { ManifestDatastoreSchema } from "../types.ts";
import {
  ISlackDatastore,
  SlackDatastoreAttributes,
  SlackDatastoreDefinition,
} from "./types.ts";

/**
 * Define a datastore and primary key and attributes for use in a Slack application.
 * @param {SlackDatastoreDefinition<SlackDatastoreAttributes>} definition Defines information about your datastore.
 * @returns {SlackDatastore}
 */
export const DefineDatastore = <Attributes extends SlackDatastoreAttributes>(
  definition: SlackDatastoreDefinition<Attributes>,
) => {
  return new SlackDatastore(definition);
};

export class SlackDatastore<Attributes extends SlackDatastoreAttributes>
  implements ISlackDatastore<Attributes> {
  public name: string;
  private definition: SlackDatastoreDefinition<Attributes>;

  constructor(definition: SlackDatastoreDefinition<Attributes>) {
    this.definition = definition;
    this.name = definition.name;
  }

  export(): ManifestDatastoreSchema {
    return {
      primary_key: this.definition.primary_key as string,
      attributes: this.definition.attributes,
    };
  }
}
