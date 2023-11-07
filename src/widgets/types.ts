import {
  ParameterPropertiesDefinition,
  ParameterSetDefinition,
  ParameterVariableType,
  PossibleParameterKeys,
} from "../parameters/types.ts";
import {
  CustomTypeParameterDefinition,
  ParameterDefinition,
  TypedArrayParameterDefinition,
  TypedObjectParameterDefinition,
  TypedObjectProperties,
  TypedObjectRequiredProperties,
} from "../parameters/definition_types.ts";
import { SlackManifest } from "../manifest/mod.ts";
import { ICustomType } from "../types/types.ts";
import type { ManifestWidgetSchema } from "../manifest/manifest_schema.ts";
import {
  IncreaseDepth,
  MaxRecursionDepth,
  RecursionDepthLevel,
} from "../type_utils.ts";

export type SlackWidgetDefinitionArgs<
  InputParameters extends ParameterSetDefinition,
  OutputParameters extends ParameterSetDefinition,
  RequiredInputs extends PossibleParameterKeys<InputParameters>,
  RequiredOutputs extends PossibleParameterKeys<OutputParameters>,
  CallbackID extends string,
> = {
  callback_id: CallbackID;
  title: string;
  description?: string;
  function_id: string;
  source_file: string;
  "input_parameters"?: ParameterPropertiesDefinition<
    InputParameters,
    RequiredInputs
  >;
  "output_parameters"?: ParameterPropertiesDefinition<
    OutputParameters,
    RequiredOutputs
  >;
};

export interface ISlackWidget {
  id: string;
  export: () => ManifestWidgetSchema;
  registerParameterTypes: (manfest: SlackManifest) => void;
}

export type WidgetInputs<
  Params extends ParameterSetDefinition,
  RequiredParams extends PossibleParameterKeys<Params>,
> = WidgetParameterReferences<Params, RequiredParams>;

export type WidgetOutputs<
  Params extends ParameterSetDefinition,
  RequiredParams extends PossibleParameterKeys<Params>,
> = WidgetParameterReferences<Params, RequiredParams>;

type WidgetParameterReferences<
  Params extends ParameterSetDefinition,
  Required extends PossibleParameterKeys<Params>,
> =
  & {
    [name in Required[number]]: ParameterVariableType<Params[name]>;
  }
  & {
    [name in keyof Params]?: ParameterVariableType<Params[name]>;
  };
