import { TypedParameterDefinition } from "../parameters/types.ts";
import { SlackProject } from "../project.ts";
import { ICustomType } from "./types.ts";

export const DefineType = <Def extends TypedParameterDefinition>(
  id: string,
  definition: Def,
) => {
  return new CustomType(id, definition);
};

export class CustomType<Def extends TypedParameterDefinition>
  implements ICustomType {
  public title: string | undefined;
  public description: string | undefined;

  constructor(
    public id: string,
    public definition: Def,
  ) {
    this.id = id;
    this.definition = definition;
    this.description = definition.description;
    this.title = definition.title;
  }

  private generateReferenceString() {
    return `#/types/${this.id}`;
  }

  toString() {
    return this.generateReferenceString();
  }
  toJSON() {
    return this.generateReferenceString();
  }

  registerParameterTypes(project: SlackProject) {
    if ("items" in this.definition) {
      // Register the item if its a type
      if (this.definition.items.type instanceof Object) {
        project.registerType(this.definition.items.type);
      }
    } else if ("properties" in this.definition) {
      // Loop through the properties and register any types
      Object.values(this.definition.properties)?.forEach((property) => {
        if ("type" in property && property.type instanceof Object) {
          project.registerType(property.type);
        }
      });
    }
  }
}
