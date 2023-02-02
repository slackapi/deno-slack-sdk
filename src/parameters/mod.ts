// import SchemaTypes from "../schema/schema_types.ts";
import type {
  ObjectParameterVariableType,
  ParameterDefinition,
  ParameterVariableType,
  SingleParameterVariable,
  TypedArrayParameterDefinition,
  TypedObjectParameter,
  TypedObjectParameterDefinition,
  TypedObjectProperties,
  TypedObjectRequiredProperties,
  UntypedObjectParameterVariableType,
} from "./types.ts";
import { ParamReference } from "./param.ts";
import { WithUntypedObjectProxy } from "./with-untyped-object-proxy.ts";
import SchemaTypes from "../schema/schema_types.ts";
import { isCustomType } from "../types/mod.ts";

// Helpers that use type predicate for narrowing down to a Typed Object or Array
export const isTypedObject = (
  def: ParameterDefinition,
): def is TypedObjectParameter => ("properties" in def);
export const isTypedArray = (
  def: ParameterDefinition,
): def is TypedArrayParameterDefinition => ("items" in def);

export const ParameterVariable = <P extends ParameterDefinition>(
  namespace: string,
  paramName: string,
  definition: P,
): ParameterVariableType<P> => {
  let param: ParameterVariableType<P> | null = null;

  if (isCustomType(definition.type)) {
    return ParameterVariable(
      namespace,
      paramName,
      definition.type.definition,
    );
  }
  switch (definition.type) {
    case SchemaTypes.object:
      if (isTypedObject(definition)) {
        param = CreateTypedObjectParameterVariable(
          namespace,
          paramName,
          definition,
        ) as ParameterVariableType<P>;
      } else {
        param = CreateUntypedObjectParameterVariable(namespace, paramName);
      }
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
  Props extends TypedObjectProperties,
  RequiredProps extends TypedObjectRequiredProperties<Props>,
  P extends TypedObjectParameterDefinition<
    Props,
    RequiredProps
  >,
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
