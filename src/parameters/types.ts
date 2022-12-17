import SchemaTypes from "../schema/schema_types.ts";
import { SlackPrimitiveTypes } from "../schema/slack/types/mod.ts";
import { ICustomType } from "../types/types.ts";

interface IParameterDefinition<
  TypeDescriptor extends string,
  Type,
> {
  /** Defines the parameter type. */
  type: TypeDescriptor;
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

type DistributePrimitiveSlackTypes<T> = T extends string ? IParameterDefinition<
    T,
    string
  >
  : never;

export type PrimitiveSlackParameterDefinition = DistributePrimitiveSlackTypes<
  typeof SlackPrimitiveTypes[keyof typeof SlackPrimitiveTypes]
>;

export type ComplexParameterDefinition =
  | CustomTypeParameterDefinition
  | TypedObjectParameterDefinition<
    TypedObjectProperties,
    TypedObjectRequiredProperties<TypedObjectProperties>
  >;

//| OAuth2ParameterDefinition;

export type CustomTypeParameterDefinition =
  & IParameterDefinition<
    typeof SchemaTypes.custom,
    AllValues
  >
  & {
    custom: ICustomType;
  };

export type UntypedObjectParameterDefinition = IParameterDefinition<
  typeof SchemaTypes.object,
  FlatObjectValue
>;

export type TypedObjectProperties = {
  [key: string]:
    | PrimitiveParameterDefinition
    | CustomTypeParameterDefinition
    | PrimitiveSlackParameterDefinition
    | UntypedObjectParameterDefinition;
};

export type TypedObjectRequiredProperties<Props extends TypedObjectProperties> =
  (Exclude<keyof Props, symbol>)[];

export type TypedObjectParameterDefinition<
  Props extends TypedObjectProperties,
  RequiredProps extends TypedObjectRequiredProperties<Props>,
> =
  & IParameterDefinition<typeof SchemaTypes.object, FlatObjectValue> // TODO: the second type parameter would not accurately reflect what typed objects would look like - would limit to flat objects only.
  & {
    /**
     * Whether the parameter can accept objects with additional keys beyond those defined via `properties`
     * @default "true"
     */
    additionalProperties?: boolean;
    /** Object defining what properties are allowed on the parameter. */
    properties: Props;
    /** A list of required property names (must reference names defined on the `properties` property). Only for use with Object types. */
    required: RequiredProps;
  };

export type UntypedArrayParameterDefinition =
  & IParameterDefinition<
    typeof SchemaTypes.array,
    AllPrimitiveValues[]
  >
  & {
    /** Minimum number of items comprising the array */
    minItems?: number;
    /** Maximum number of items comprising the array */
    maxItems?: number;
  };

export type TypedArrayParameterDefinition =
  & IParameterDefinition<
    typeof SchemaTypes.array,
    AllPrimitiveValues[]
  >
  & {
    /** Minimum number of items comprising the array */
    minItems?: number;
    /** Maximum number of items comprising the array */
    maxItems?: number;
    /** Defines the type of the items contained within the array parameter. */
    items: ParameterDefinition;
  };

export type OAuth2ParameterDefinition =
  & IParameterDefinition<typeof SlackPrimitiveTypes.oauth2, string>
  & {
    oauth2_provider_key: string;
  };

type BooleanParameterDefinition = IParameterDefinition<
  typeof SchemaTypes.boolean,
  boolean
>;

type StringParameterDefinition =
  & IParameterDefinition<typeof SchemaTypes.string, string>
  & {
    /** Minimum number of characters comprising the string */
    minLength?: number;
    /** Maximum number of characters comprising the string */
    maxLength?: number;
    /** Constrain the available string options to just the list of strings denoted in the `enum` property. Usage of `enum` also instructs any UI that collects a value for this parameter to render a dropdown select input rather than a free-form text input. */
    enum?: string[];
    /** Defines labels that correspond to the `enum` values. */
    choices?: EnumChoice<string>[];
  };

type IntegerParameterDefinition =
  & IParameterDefinition<typeof SchemaTypes.integer, number>
  & {
    /** Absolute minimum acceptable value for the integer */
    minimum?: number;
    /** Absolute maximum acceptable value for the integer */
    maximum?: number;
    /** Constrain the available integer options to just the list of integers denoted in the `enum` property. Usage of `enum` also instructs any UI that collects a value for this parameter to render a dropdown select input rather than a free-form text input. */
    enum?: number[];
    /** Defines labels that correspond to the `enum` values. */
    choices?: EnumChoice<number>[];
  };

type NumberParameterDefinition =
  & IParameterDefinition<typeof SchemaTypes.number, number>
  & {
    /** Absolute minimum acceptable value for the number */
    minimum?: number;
    /** Absolute maximum acceptable value for the number */
    maximum?: number;
    /** Constrain the available number options to just the list of numbers denoted in the `enum` property. Usage of `enum` also instructs any UI that collects a value for this parameter to render a dropdown select input rather than a free-form text input. */
    enum?: number[];
    /** Defines labels that correspond to the `enum` values. */
    choices?: EnumChoice<number>[];
  };

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
