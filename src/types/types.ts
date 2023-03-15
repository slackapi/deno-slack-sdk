import {
  CustomTypeParameterDefinition,
  ParameterDefinitionWithGenerics,
  TypedArrayParameterDefinition,
  TypedObjectParameter,
  TypedObjectParameterDefinition,
  TypedObjectProperties,
  TypedObjectRequiredProperties,
  TypedParameterDefinition,
  UntypedObjectParameterDefinition,
} from "../parameters/definition_types.ts";
import { SlackManifest } from "../manifest/mod.ts";
import { ManifestCustomTypeSchema } from "../manifest/manifest_schema.ts";
import { DefineType } from "./mod.ts";
import { ParameterPropertiesDefinition } from "../parameters/types.ts";
import {
  FunctionInputRuntimeType,
  FunctionRuntimeParameters,
} from "../functions/types.ts";

export type CustomTypeDefinition<
  Props extends TypedObjectProperties,
  RequiredProps extends TypedObjectRequiredProperties<Props>,
> =
  & { name: string }
  & ParameterDefinitionWithGenerics<Props, RequiredProps>;

export interface ICustomType<
  Props extends TypedObjectProperties = TypedObjectProperties,
  RequiredProps extends TypedObjectRequiredProperties<Props> =
    TypedObjectRequiredProperties<Props>,
> {
  id: string;
  definition: CustomTypeDefinition<Props, RequiredProps>;
  description?: string;
  registerParameterTypes: (manifest: SlackManifest) => void;
  export(): ManifestCustomTypeSchema;
}

type NonFunctionProperty<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
type PickProperties<T> = Pick<T, NonFunctionProperty<T>>;

// TypedObjectParameter;
// export type TypedObjectProperties<
//   Props extends TypedObjectProperties,
//   RequiredProps extends TypedObjectRequiredProperties<Props>,
// > =
//   & {
//     [k in RequiredProps[number]]: FunctionInputRuntimeType<
//       Params[k]
//     >;
//   }
//   & {
//     [k in keyof Params]?: FunctionInputRuntimeType<
//       Params[k]
//     >;
//   };

type TypedObjectParameterType<T extends TypedObjectParameter> = T extends
  ParameterPropertiesDefinition<infer P, infer R>
  ? FunctionRuntimeParameters<P, R>
  : PickProperties<T>;

type TypedCustomTypeParameterDefinition<
  T extends CustomTypeParameterDefinition,
> = T extends ParameterPropertiesDefinition<infer P, infer R>
  ? FunctionRuntimeParameters<P, R>
  : PickProperties<T>;

type UntypedObjectParameterDefinitionType<
  T extends UntypedObjectParameterDefinition,
> = T extends ParameterPropertiesDefinition<infer P, infer R>
  ? FunctionRuntimeParameters<P, R>
  : PickProperties<T>;
type TypedParameterDefinitionType<T extends TypedParameterDefinition> =
  T extends TypedObjectParameter ? TypedObjectParameterType<T>
    : T extends TypedArrayParameterDefinition
      ? PickProperties<T> & TypedParameterDefinitionType<T["items"]>
    : T extends CustomTypeParameterDefinition
      ? TypedCustomTypeParameterDefinition<T>
    : T extends UntypedObjectParameterDefinition
      ? UntypedObjectParameterDefinitionType<T>
    : PickProperties<T>;

// export type CustomType<T extends ReturnType<typeof DefineType>> =
//   TypedParameterDefinitionType<T["definition"]>;
// export type CustomType<T extends ReturnType<typeof DefineType>> =
//   T["definition"] extends ParameterPropertiesDefinition<infer P, infer R>
//     ? FunctionRuntimeParameters<P, R>
//     : PickProperties<T["definition"]>;

export type CustomType<T extends ReturnType<typeof DefineType>> =
  FunctionInputRuntimeType<T["definition"]>;
