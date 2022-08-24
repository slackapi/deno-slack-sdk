import { SlackManifest } from "../manifest/mod.ts";
import { ManifestCustomEventSchema } from "../manifest/manifest_schema.ts";
import {
  CustomEventDefinition,
  DefineEventSignature,
  ICustomEvent,
} from "./types.ts";

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
    if ("properties" in this.definition) {
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
  export(): ManifestCustomEventSchema {
    // remove name from the definition we pass to the manifest
    const { name: _n, ...definition } = this.definition;
    return definition;
  }
}
