import { SlackManifest } from "../manifest/mod.ts";
import { ManifestCustomEventSchema } from "../manifest/manifest_schema.ts";
import {
  CustomEventDefinition,
  DefineEventSignature,
  ICustomEvent,
} from "./types.ts";
import SchemaTypes from "../schema/schema_types.ts";

export const DefineEvent: DefineEventSignature = <
  Def extends CustomEventDefinition,
>(
  definition: Def,
) => {
  return new CustomEvent(definition);
};

export class CustomEvent<Def extends CustomEventDefinition>
  implements ICustomEvent {
  public id: string;
  public title: string | undefined;
  public description: string | undefined;

  constructor(
    public definition: Def,
  ) {
    this.id = definition.name;
    this.definition = definition;
    this.description = definition.description;
    this.title = definition.title;
  }

  private generateReferenceString() {
    return this.id;
  }

  toString() {
    return this.generateReferenceString();
  }

  toJSON() {
    return this.generateReferenceString();
  }

  registerParameterTypes(manifest: SlackManifest) {
    switch (this.definition.type) {
      case SchemaTypes.typedobject:
        // Loop through the properties and register any types
        Object.values(this.definition.properties)?.forEach((property) => {
          if (property.type === SchemaTypes.custom) {
            manifest.registerType(property);
          }
        });
        break;
      case SchemaTypes.custom:
        manifest.registerType(this.definition);
        break;
    }
  }
  export(): ManifestCustomEventSchema {
    // remove name from the definition we pass to the manifest
    const { name: _n, ...definition } = this.definition;
    // Using JSON.stringify to force any custom types into their string reference
    return JSON.parse(JSON.stringify(definition));
  }
}
