import {
  IncreaseDepth,
  MaxRecursionDepth,
  RecursionDepthLevel,
} from "../type_utils.ts";
import {
  CustomTypeParameterDefinition,
  ParameterDefinition,
  TypedObjectParameter,
  TypedObjectProperties,
  UntypedObjectParameterDefinition,
} from "./definition_types.ts";

// Used for defining a set of input or output parameters
export type ParameterSetDefinition = {
  [key: string]: ParameterDefinition;
};

export type PossibleParameterKeys<
  ParameterSetInternal extends ParameterSetDefinition,
> = (keyof ParameterSetInternal)[];

export type ParameterPropertiesDefinition<
  Params extends ParameterSetDefinition,
  Required extends PossibleParameterKeys<Params>,
> = {
  properties: Params;
  required: Required;
};

export type ParameterVariableType<
  Def extends ParameterDefinition,
  CurrentDepth extends RecursionDepthLevel = 0,
> = CurrentDepth extends MaxRecursionDepth ? UntypedObjectParameterVariableType // i.e. any
  : Def extends CustomTypeParameterDefinition // If the ParameterVariable is a Custom type, use it's definition instead
    ? ParameterVariableType<
      Def["type"]["definition"],
      IncreaseDepth<CurrentDepth>
    >
  // If the ParameterVariable is of type object, allow access to the object's properties
  : Def extends TypedObjectParameter ? ObjectParameterVariableType<Def>
  : Def extends UntypedObjectParameterDefinition
    ? UntypedObjectParameterVariableType
  : SingleParameterVariable;

// deno-lint-ignore ban-types
export type SingleParameterVariable = {};

// deno-lint-ignore no-explicit-any
export type UntypedObjectParameterVariableType = any;

export type ObjectParameterPropertyTypes<
  Props extends TypedObjectProperties,
> = {
  [name in keyof Props]: ParameterVariableType<
    Props[name]
  >;
};

// If additionalProperties is set to true, allow access to any key.
// Otherwise, only allow keys provided through use of properties
export type ObjectParameterVariableType<
  Def extends TypedObjectParameter,
> =
  & ObjectParameterPropertyTypes<Def["properties"]>
  & (Def["additionalProperties"] extends false ? Record<never, never>
    : {
      // deno-lint-ignore no-explicit-any
      [key: string]: any;
    });
