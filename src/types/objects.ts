import {
  TypedObjectParameterDefinition,
  TypedObjectProperties,
  TypedObjectRequiredProperties,
} from "../parameters/types.ts";
import SchemaTypes from "../schema/schema_types.ts";

export const DefineParameter = <
  Props extends TypedObjectProperties,
  RequiredProps extends TypedObjectRequiredProperties<Props>,
  Def extends TypedObjectParameterDefinition<Props, RequiredProps>,
>(
  definition: Def,
) => {
  const obj = new TypedObject(definition);
  return obj.definition;
};

export class TypedObject<
  Props extends TypedObjectProperties,
  RequiredProps extends TypedObjectRequiredProperties<Props>,
  Def extends TypedObjectParameterDefinition<Props, RequiredProps>,
> {
  public type: typeof SchemaTypes.object;

  constructor(
    public definition: Def,
  ) {
    this.definition = definition;
    this.type = SchemaTypes.object;
  }
}
