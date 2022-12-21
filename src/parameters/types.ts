import SchemaTypes from "../schema/schema_types.ts";
import { SlackPrimitiveTypes } from "../schema/slack/types/mod.ts";
import { ICustomType } from "../types/types.ts";

interface IParameterDefinition<
  Type,
> {
  /** Defines the parameter type. */
  type: string | ICustomType;
  /** An optional parameter title. */
  title?: string;
  /** An optional parameter description. */
  description?: string;
  /** An optional parameter hint. */
  hint?: string;
  /** An optional parameter default value. */
  default?: Type;
  /** An option list of examples; intended for future use in a possible app type schemas page. */
  examples?: Type[];
}

export type ParameterDefinition =
  | PrimitiveParameterDefinition
  | PrimitiveSlackParameterDefinition
  | ComplexParameterDefinition;

export type PrimitiveParameterDefinition =
  | BooleanParameterDefinition
  | StringParameterDefinition
  | NumberParameterDefinition
  | IntegerParameterDefinition
  | TypedArrayParameterDefinition
  | UntypedObjectParameterDefinition
  | UntypedArrayParameterDefinition;

// TODO: Revisit as I don't think passing a string here is valid as `default` and `examples` need to be of the specified type (boolean, number, etc.)
// We also aren't getting a discriminate union here, so if you specify `number` you aren't getting the fields unique to number
type DistributePrimitiveSlackTypes = IParameterDefinition<
  string
>;

export type PrimitiveSlackParameterDefinition = DistributePrimitiveSlackTypes;

export type ComplexParameterDefinition =
  | CustomTypeParameterDefinition
  | TypedObjectParameter;

// TODO: Address OAuth2
//| OAuth2ParameterDefinition;

export interface CustomTypeParameterDefinition extends
  IParameterDefinition<
    AllValues
  > {
  type: ICustomType;
}

export interface UntypedObjectParameterDefinition extends
  IParameterDefinition<
    FlatObjectValue
  > {
  type: typeof SchemaTypes.object;
}

export type TypedObjectProperties = {
  [key: string]:
    | PrimitiveParameterDefinition
    | CustomTypeParameterDefinition
    | PrimitiveSlackParameterDefinition
    | UntypedObjectParameterDefinition;
};

export type TypedObjectRequiredProperties<Props extends TypedObjectProperties> =
  (Exclude<keyof Props, symbol>)[];

export interface TypedObjectParameterDefinition<
  Props extends TypedObjectProperties,
  RequiredProps extends TypedObjectRequiredProperties<Props>,
> extends IParameterDefinition<FlatObjectValue> // TODO: the second type parameter would not accurately reflect what typed objects would look like - would limit to flat objects only.
{
  type: typeof SchemaTypes.object;
  /**
   * Whether the parameter can accept objects with additional keys beyond those defined via `properties`
   * @default "true"
   */
  additionalProperties?: boolean;
  /** Object defining what properties are allowed on the parameter. */
  properties: Props;
  /** A list of required property names (must reference names defined on the `properties` property). Only for use with Object types. */
  required: RequiredProps;
}

export type TypedObjectParameter = TypedObjectParameterDefinition<
  TypedObjectProperties,
  TypedObjectRequiredProperties<TypedObjectProperties>
>;
export interface UntypedArrayParameterDefinition
  extends IParameterDefinition<AllPrimitiveValues[]> {
  type: typeof SchemaTypes.array;
}

export interface TypedArrayParameterDefinition
  extends IParameterDefinition<AllPrimitiveValues[]> {
  type: typeof SchemaTypes.array;
  /** Minimum number of items comprising the array */
  minItems?: number;
  /** Maximum number of items comprising the array */
  maxItems?: number;
  /** Defines the type of the items contained within the array parameter. */
  items: ParameterDefinition;
}

export interface OAuth2ParameterDefinition
  extends IParameterDefinition<string> {
  type: typeof SlackPrimitiveTypes.oauth2;
  oauth2_provider_key: string;
}

interface BooleanParameterDefinition extends
  IParameterDefinition<
    boolean
  > {
  type: typeof SchemaTypes.boolean;
}

interface StringParameterDefinition extends IParameterDefinition<string> {
  type: typeof SchemaTypes.string;
  /** Minimum number of characters comprising the string */
  minLength?: number;
  /** Maximum number of characters comprising the string */
  maxLength?: number;
  /** Constrain the available string options to just the list of strings denoted in the `enum` property. Usage of `enum` also instructs any UI that collects a value for this parameter to render a dropdown select input rather than a free-form text input. */
  enum?: string[];
  /** Defines labels that correspond to the `enum` values. */
  choices?: EnumChoice<string>[];
}

interface IntegerParameterDefinition extends IParameterDefinition<number> {
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

interface NumberParameterDefinition extends IParameterDefinition<number> {
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

type EnumChoice<T> = {
  /** The `enum` value this {@link EnumChoice} corresponds to. */
  value: T;
  /** The label to display for this {@link EnumChoice}. */
  title: string;
  /** An optional description for this {@link EnumChoice}. Intended for potential future use in a possible app type schemas page. */
  description?: string;
};

type AllValues = AllPrimitiveValues | AllPrimitiveValues[] | FlatObjectValue;

type AllPrimitiveValues = string | number | boolean;

type FlatObjectValue = {
  [key: string]: AllPrimitiveValues | AllPrimitiveValues[];
};
