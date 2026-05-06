import { SlackManifest } from "../manifest/mod.ts";
import { ManifestCustomTypeSchema } from "../manifest/manifest_schema.ts";
import { CustomTypeDefinition, ICustomType } from "./types.ts";
import { isTypedArray, isTypedObject } from "../parameters/mod.ts";
import {
  TypedObjectProperties,
  TypedObjectRequiredProperties,
} from "../parameters/definition_types.ts";

// Helper that uses a type predicate for narrowing down to a Custom Type
export const isCustomType = (type: string | ICustomType): type is ICustomType =>
  type instanceof CustomType;

export function DefineType<
  Props extends TypedObjectProperties,
  RequiredProps extends TypedObjectRequiredProperties<Props>,
  Def extends CustomTypeDefinition<Props, RequiredProps>,
>(
  definition: Def,
): CustomType<Props, RequiredProps, Def> {
  return new CustomType(definition);
}

export class CustomType<
  Props extends TypedObjectProperties,
  RequiredProps extends TypedObjectRequiredProperties<Props>,
  Def extends CustomTypeDefinition<Props, RequiredProps>,
> implements ICustomType {
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
    if (isCustomType(this.definition.type)) {
      manifest.registerType(this.definition.type);
    } else if (isTypedArray(this.definition)) {
      if (isCustomType(this.definition.items.type)) {
        manifest.registerType(this.definition.items.type);
      }
    } else if (isTypedObject(this.definition)) {
      Object.values(this.definition.properties)?.forEach((property) => {
        if (isCustomType(property.type)) {
          manifest.registerType(property.type);
        }
      });
    }
  }

  export(): ManifestCustomTypeSchema {
    // remove name from the definition we pass to the manifest
    const { name: _n, ...definition } = this.definition;
    // Using JSON.stringify to force any custom types into their string reference
    return JSON.parse(JSON.stringify(definition));
  }
}
