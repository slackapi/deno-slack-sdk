import { SlackManifest } from "../manifest/mod.ts";
import { ManifestCustomTypeSchema } from "../manifest/manifest_schema.ts";
import {
  CustomTypeDefinition,
  DefineTypeFunction,
  ICustomType,
} from "./types.ts";
import SchemaTypes from "../schema/schema_types.ts";

export const DefineType: DefineTypeFunction = <
  Def extends CustomTypeDefinition,
>(
  definition: Def,
) => {
  return new CustomType(definition);
};

export class CustomType<Def extends CustomTypeDefinition>
  implements ICustomType {
  public id: string;
  public title: string | undefined;
  public description: string | undefined;
  public type: typeof SchemaTypes.custom;

  constructor(
    public definition: Def,
  ) {
    this.id = definition.name;
    this.definition = definition;
    this.description = definition.description;
    this.title = definition.title;
    this.type = SchemaTypes.custom;
  }

  private generateReferenceString() {
    return this.id.includes("#/") ? this.id : `#/types/${this.id}`;
  }

  toString() {
    return this.generateReferenceString();
  }
  toJSON() {
    return this.generateReferenceString();
  }

  registerParameterTypes(manifest: SlackManifest) {
    switch (this.definition.type) {
      // TODO: reintroduce array types

      case SchemaTypes.array:
        if ("items" in this.definition) {
          if (this.definition.items.type === SchemaTypes.custom) {
            manifest.registerType(this.definition.items.custom);
          }
        }
        break;

      case SchemaTypes.object:
        if ("properties" in this.definition) {
          Object.values(this.definition.properties)?.forEach((property) => {
            if (property.type === SchemaTypes.custom) {
              manifest.registerType(property.custom);
            }
          });
        }
        break;
      case SchemaTypes.custom:
        manifest.registerType(this.definition.custom);
        break;
      default:
        break;
    }
  }
  export(): ManifestCustomTypeSchema {
    // remove name from the definition we pass to the manifest
    const { name: _n, ...definition } = this.definition;
    // Using JSON.stringify to force any custom types into their string reference
    return JSON.parse(JSON.stringify(definition));
  }
}
