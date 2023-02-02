import SchemaTypes from "../schema/schema_types.ts";
import { SlackPrimitiveTypes } from "../schema/slack/types/mod.ts";
import { ICustomType } from "../types/types.ts";
import {
  IncreaseDepth,
  MaxRecursionDepth,
  RecursionDepthLevel,
} from "../type_utils.ts";

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

export type ParameterDefinition = TypedParameterDefinition;

export type PrimitiveParameterDefinition =
  | BooleanParameterDefinition
  | StringParameterDefinition
  | NumberParameterDefinition
  | IntegerParameterDefinition
  | BaseParameterDefinition<AllValues>
  // | UntypedArrayParameterDefinition
  | TypedArrayParameterDefinition;

export type TypedParameterDefinition =
  | CustomTypeParameterDefinition
  | TypedObjectParameter
  | UntypedObjectParameterDefinition
  | PrimitiveParameterDefinition
  | OAuth2ParameterDefinition;

export interface CustomTypeParameterDefinition
  extends Omit<BaseParameterDefinition<AllValues>, "type"> {
  type: ICustomType;
}

interface BaseParameterDefinition<T> {
  /** Defines the parameter type. */
  type: string;
  /** An optional parameter title. */
  title?: string;
  /** An optional parameter description. */
  description?: string;
  /** An optional parameter hint. */
  hint?: string;
  /** An optional parameter default value. */
  default?: T;
  /** An option list of examples; intended for future use in a possible app type schemas page. */
  examples?: T[];
}

/**
 * Only used for defining Custom Types via `DefineType`
 * The below type is explicitly different from the above ParameterDefinition type in that:
 * - It replaces the generic-less ComplexParameterDefinition so that...
 * - It can lift the generic-ful TypeddObjectParamaterDefinition's generics to ParameterDefinitionWithgenerics so that...
 * - The props/required props generic pair, which rely on each other, can be exposed in DefineType so that...
 * - .. the dependency between props/required props can be raised to the dev when authoring function runtime logic, and e.g. not returning a required property in a function output
 */
export type ParameterDefinitionWithGenerics<
  Props extends TypedObjectProperties,
  RequiredProps extends TypedObjectRequiredProperties<Props>,
> =
  | Exclude<ParameterDefinition, TypedObjectParameter>
  | TypedObjectParameterDefinition<Props, RequiredProps>;

export interface UntypedObjectParameterDefinition
  extends BaseParameterDefinition<ObjectValue> {
  type: typeof SchemaTypes.object;
}

export type TypedObjectProperties = {
  [key: string]:
    | PrimitiveParameterDefinition
    | CustomTypeParameterDefinition;
};

export type TypedObjectRequiredProperties<Props extends TypedObjectProperties> =
  | (Exclude<keyof Props, symbol>)[]
  | undefined;

/**
 * Models the shape of a Typed Object parameter, and using the two generics,
 * models the dependent relationship between the properties of an object and which of the properties are required vs. optional
 */
export interface TypedObjectParameterDefinition<
  Props extends TypedObjectProperties,
  RequiredProps extends TypedObjectRequiredProperties<Props>,
> extends UntypedObjectParameterDefinition // TODO: the second type parameter would not accurately reflect what typed objects would look like - would limit to flat objects only.
{
  /**
   * Whether the parameter can accept objects with additional keys beyond those defined via `properties`
   * @default "true"
   */
  additionalProperties?: boolean;
  /** Object defining what properties are allowed on the parameter. */
  properties: Props;
  /** A list of required property names (must reference names defined on the `properties` property). Only for use with Object types. */
  required?: RequiredProps;
}

/**
 * Models _only_ the shape of a Typed Object parameter
 * Unlike TypedObjectParameterDefinition above, does _not_ constrain the elements
 * of the `required` array to the keys of the `properties` object.
 */
export type TypedObjectParameter = TypedObjectParameterDefinition<
  TypedObjectProperties,
  TypedObjectRequiredProperties<TypedObjectProperties>
>;

interface BooleanParameterDefinition extends BaseParameterDefinition<boolean> {
  type: typeof SchemaTypes.boolean;
}

interface StringParameterDefinition extends BaseParameterDefinition<string> {
  type: typeof SchemaTypes.string;
  /** Minimum number of characters comprising the string */
  minLength?: number;
  /** Maximum number of characters comprising the string */
  maxLength?: number;
  /** Constrain the available string options to just the list of strings denoted in the `enum` property. Usage of `enum` also instructs any UI that collects a value for this parameter to render a dropdown select input rather than a free-form text input. */
  enum?: string[];
  /** Defines labels that correspond to the `enum` values. */
  choices?: EnumChoice<string>[];
  /** Define accepted format of the string */
  format?: "url" | "email";
}

interface IntegerParameterDefinition extends BaseParameterDefinition<number> {
  type: typeof SchemaTypes.integer;
  /** Absolute minimum acceptable value for the integer */
  minimum?: number;
  /** Absolute maximum acceptable value for the integer */
  maximum?: number;
  /** Constrain the available integer options to just the list of integers denoted in the `enum` property. Usage of `enum` also instructs any UI that collects a value for this parameter to render a dropdown select input rather than a free-form text input. */
  enum?: number[];
  /** Defines labels that correspond to the `enum` values. */
  choices?: EnumChoice<number>[];
}

interface NumberParameterDefinition extends BaseParameterDefinition<number> {
  type: typeof SchemaTypes.number;
  /** Absolute minimum acceptable value for the number */
  minimum?: number;
  /** Absolute maximum acceptable value for the number */
  maximum?: number;
  /** Constrain the available number options to just the list of numbers denoted in the `enum` property. Usage of `enum` also instructs any UI that collects a value for this parameter to render a dropdown select input rather than a free-form text input. */
  enum?: number[];
  /** Defines labels that correspond to the `enum` values. */
  choices?: EnumChoice<number>[];
}

interface OAuth2ParameterDefinition extends BaseParameterDefinition<string> {
  type: typeof SlackPrimitiveTypes.oauth2;
  oauth2_provider_key: string;
}

type EnumChoice<T> = {
  /** The `enum` value this {@link EnumChoice} corresponds to. */
  value: T;
  /** The label to display for this {@link EnumChoice}. */
  title: string;
  /** An optional description for this {@link EnumChoice}. Intended for potential future use in a possible app type schemas page. */
  description?: string;
};

interface UntypedArrayParameterDefinition
  extends BaseParameterDefinition<ArrayValue> {
  type: typeof SchemaTypes.array;
  /** Minimum number of items comprising the array */
  minItems?: number;
  /** Maximum number of items comprising the array */
  maxItems?: number;
}

export interface TypedArrayParameterDefinition
  extends UntypedArrayParameterDefinition {
  /** Defines the type of the items contained within the array parameter. */
  items: ParameterDefinition;
}

type AllValues = AllPrimitiveValues | ObjectValue | ArrayValue;

type AllPrimitiveValues = string | number | boolean;

type ObjectValue = {
  [key: string]: AllPrimitiveValues | AllPrimitiveValues[];
};

type ArrayValue = AllPrimitiveValues[];
