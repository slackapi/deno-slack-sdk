import {
  TypedObjectParameterDefinition,
  TypedObjectProperties,
  TypedObjectRequiredProperties,
} from "../parameters/types.ts";
import SchemaTypes from "../schema/schema_types.ts";

export const DefineObject = <
  Props extends TypedObjectProperties,
  RequiredProps extends TypedObjectRequiredProperties<Props>,
>(
  definition: TypedObjectParameterDefinition<Props, RequiredProps>,
) => {
  const obj = new TypedObject(definition);
  return obj.definition;
};

// export interface ITypedObject<
//   Props extends TypedObjectProperties,
//   RequiredProps extends TypedObjectRequiredProperties<Props>,
//   Def extends TypedObjectParameterDefinition<Props, RequiredProps>,
// > {
//   definition: Def;
// }

export class TypedObject<
  Props extends TypedObjectProperties,
  RequiredProps extends TypedObjectRequiredProperties<Props>,
> {
  public type: typeof SchemaTypes.typedobject;

  constructor(
    public definition: TypedObjectParameterDefinition<Props, RequiredProps>,
  ) {
    this.definition = definition;
    this.type = SchemaTypes.typedobject;
  }
}
