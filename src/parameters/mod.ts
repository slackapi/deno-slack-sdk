// import SchemaTypes from "../schema/schema_types.ts";
import type {
  CustomTypeParameterDefinition,
  ParameterDefinition,
  TypedObjectParameterDefinition,
  UntypedObjectParameterDefinition,
} from "./types.ts";
import { ParamReference } from "./param.ts";
import {
  IncreaseDepth,
  MaxRecursionDepth,
  RecursionDepthLevel,
} from "../functions/types.ts";
import { WithUntypedObjectProxy } from "./with-untyped-object-proxy.ts";
import SchemaTypes from "../schema/schema_types.ts";

// Used for defining a set of input or output parameters
export type ParameterSetDefinition = {
  [key: string]: ParameterDefinition;
};

export type PossibleParameterKeys<
  ParameterSetInternal extends ParameterSetDefinition,
> = (keyof ParameterSetInternal)[];

export type ParameterPropertiesDefinition<
  Parameters extends ParameterSetDefinition,
  Required extends PossibleParameterKeys<Parameters>,
> = {
  properties: Parameters;
  required: Required;
};

export type ParameterVariableType<
  Def extends ParameterDefinition,
  CurrentDepth extends RecursionDepthLevel = 0,
> = CurrentDepth extends MaxRecursionDepth ? UntypedObjectParameterVariableType // i.e. any
  : Def extends CustomTypeParameterDefinition // If the ParameterVariable is a Custom type, use it's definition instead
    ? ParameterVariableType<Def["definition"], IncreaseDepth<CurrentDepth>>
  : Def extends TypedObjectParameterDefinition // If the ParameterVariable is of type object, allow access to the object's properties
    ? ObjectParameterVariableType<Def>
  : Def extends UntypedObjectParameterDefinition
    ? UntypedObjectParameterVariableType
  : SingleParameterVariable;

// deno-lint-ignore ban-types
type SingleParameterVariable = {};

// deno-lint-ignore no-explicit-any
type UntypedObjectParameterVariableType = any;

type ObjectParameterPropertyTypes<Def extends TypedObjectParameterDefinition> =
  {
    [name in keyof Def["properties"]]: ParameterVariableType<
      Def["properties"][name]
    >;
  };

// If additionalProperties is set to true, allow access to any key.
// Otherwise, only allow keys provided through use of properties
type ObjectParameterVariableType<Def extends TypedObjectParameterDefinition> =
  Def["additionalProperties"] extends false ? ObjectParameterPropertyTypes<Def>
    : 
      & ObjectParameterPropertyTypes<Def>
      & {
        // deno-lint-ignore no-explicit-any
        [key: string]: any;
      };

export const ParameterVariable = <P extends ParameterDefinition>(
  namespace: string,
  paramName: string,
  definition: P,
): ParameterVariableType<P> => {
  let param: ParameterVariableType<P> | null = null;

  switch (definition.type) {
    case SchemaTypes.custom:
      param = ParameterVariable(
        namespace,
        paramName,
        definition.definition,
      );
      break;
    case SchemaTypes.typedobject:
      param = CreateTypedObjectParameterVariable(
        namespace,
        paramName,
        definition,
      ) as ParameterVariableType<P>;
      break;
    case SchemaTypes.untypedobject:
      param = CreateUntypedObjectParameterVariable(namespace, paramName);
      break;
    default:
      param = CreateSingleParameterVariable(
        namespace,
        paramName,
      ) as ParameterVariableType<P>;
  }
  // TODO: the following type assertion seems to ignore the case where param could be null
  return param as ParameterVariableType<P>;
};

const CreateTypedObjectParameterVariable = <
  P extends TypedObjectParameterDefinition,
>(
  namespace: string,
  paramName: string,
  definition: P,
): ObjectParameterVariableType<P> => {
  const ns = namespace ? `${namespace}.` : "";
  const pathReference = `${ns}${paramName}`;
  const param = ParamReference(pathReference);

  for (
    const [propName, propDefinition] of Object.entries(
      definition.properties || {},
    )
  ) {
    param[propName as string] = ParameterVariable(
      pathReference,
      propName,
      propDefinition,
    );
  }

  // We wrap the typed object parameter w/ an untyped proxy to allow indexing into additional properties
  return WithUntypedObjectProxy(
    param,
    namespace,
    paramName,
  ) as ObjectParameterVariableType<P>;
};

export const CreateUntypedObjectParameterVariable = (
  namespace: string,
  paramName: string,
): UntypedObjectParameterVariableType => {
  return WithUntypedObjectProxy(
    {},
    namespace,
    paramName,
  ) as UntypedObjectParameterVariableType;
};

const CreateSingleParameterVariable = (
  namespace: string,
  paramName: string,
): SingleParameterVariable => {
  return ParamReference(namespace, paramName) as SingleParameterVariable;
};
