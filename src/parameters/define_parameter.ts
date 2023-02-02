import {
  TypedObjectParameterDefinition,
  TypedObjectProperties,
  TypedObjectRequiredProperties,
} from "../parameters/types.ts";

export const DefineProperty = <
  Props extends TypedObjectProperties,
  RequiredProps extends TypedObjectRequiredProperties<Props>,
  Def extends TypedObjectParameterDefinition<Props, RequiredProps>,
>(
  definition: Def,
) => {
  return definition;
};
