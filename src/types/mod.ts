import { SlackManifest } from "../manifest/mod.ts";
import { ManifestCustomTypeSchema } from "../manifest/manifest_schema.ts";
import {
  CustomTypeDefinition,
  DefineTypeFunction,
  ICustomType,
} from "./types.ts";

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

  constructor(
    public definition: Def,
  ) {
    this.id = definition.name;
    this.definition = definition;
    this.description = definition.description;
    this.title = definition.title;
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
    if ("items" in this.definition) {
      // Register the item if its a type
      if (this.definition.items.type instanceof Object) {
        manifest.registerType(this.definition.items.type);
      }
    } else if ("properties" in this.definition) {
      // Loop through the properties and register any types
      Object.values(this.definition.properties)?.forEach((property) => {
        if ("type" in property && property.type instanceof Object) {
          manifest.registerType(property.type);
        }
      });
    } else if (this.definition.type instanceof Object) {
      // The referenced type is a Custom Type
      manifest.registerType(this.definition.type);
    }
  }
  export(): ManifestCustomTypeSchema {
    // remove name from the definition we pass to the manifest
    const { name: _n, ...definition } = this.definition;
    return definition;
  }
}
