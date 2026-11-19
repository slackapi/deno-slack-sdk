import type { SlackManifest } from "../manifest/mod.ts";
import type { ManifestCustomEventSchema } from "../manifest/manifest_schema.ts";
import type {
  CustomEventDefinition,
  DefineEventSignature,
  ICustomEvent,
} from "./types.ts";
import { isCustomType } from "../types/mod.ts";
import { isTypedObject } from "../parameters/mod.ts";

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
    if (isCustomType(this.definition.type)) {
      manifest.registerType(this.definition.type);
    } else if (isTypedObject(this.definition)) {
      Object.values(this.definition.properties)?.forEach((property) => {
        if (isCustomType(property.type)) {
          manifest.registerType(property.type);
        }
      });
    }
  }
  export(): ManifestCustomEventSchema {
    // remove name from the definition we pass to the manifest
    const { name: _n, ...definition } = this.definition;
    // Using JSON.stringify to force any custom types into their string reference
    return JSON.parse(JSON.stringify(definition));
  }
}
