import {
  ISlackDatastore,
  ManifestDatastoreSchema,
  SlackDatastoreAttributes,
  SlackDatastoreDefinition,
} from "./types.ts";
export const DefineDatastore = <Attributes extends SlackDatastoreAttributes>(
  name: string,
  definition: SlackDatastoreDefinition<Attributes>,
) => {
  return new SlackDatastore(name, definition);
};

class SlackDatastore<Attributes extends SlackDatastoreAttributes>
  implements ISlackDatastore<Attributes> {
  public name: string;

  private definition: SlackDatastoreDefinition<Attributes>;

  constructor(name: string, definition: SlackDatastoreDefinition<Attributes>) {
    this.name = name;
    this.definition = definition;
  }

  export(): ManifestDatastoreSchema {
    return {
      primary_key: this.definition.primary_key as string,
      attributes: this.definition.attributes,
    };
  }
}
