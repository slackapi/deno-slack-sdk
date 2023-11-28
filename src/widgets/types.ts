import { SlackManifest } from "../manifest/mod.ts";
import type { ManifestWidgetSchema } from "../manifest/manifest_schema.ts";
import {
  ParameterPropertiesDefinition,
  ParameterSetDefinition,
  ParameterVariableType,
  PossibleParameterKeys,
} from "../parameters/types.ts";

export interface ISlackWidget {
  id: string;
  export: () => ManifestWidgetSchema;
  registerStepFunctions: (manifest: SlackManifest) => void;
  registerParameterTypes: (manfest: SlackManifest) => void;
}

export enum SlackWidgetDataMode {
  PER_INSTALLER = "per_installer",
  PER_USER = "per_user",
}

export interface SlackWidgetConfig {
  data_mode: SlackWidgetDataMode;
}

export type SlackWidgetDefinition<Definition> = Definition extends
  SlackWidgetDefinitionArgs<
    infer I,
    infer O,
    infer RI,
    infer RO,
    infer CB,
    infer C
  > ? SlackWidgetDefinitionArgs<I, O, RI, RO, CB, C>
  : never;

export type SlackWidgetDefinitionArgs<
  InputParameters extends ParameterSetDefinition,
  OutputParameters extends ParameterSetDefinition,
  RequiredInputs extends PossibleParameterKeys<InputParameters>,
  RequiredOutputs extends PossibleParameterKeys<OutputParameters>,
  CallbackID extends string,
  Config extends SlackWidgetConfig,
> = {
  callback_id: CallbackID;
  title: string;
  config: Config;
  description?: string;
  "input_parameters"?: ParameterPropertiesDefinition<
    InputParameters,
    RequiredInputs
  >;
  "output_parameters": ParameterPropertiesDefinition<
    OutputParameters,
    RequiredOutputs
  >;
};

export type WidgetInputs<
  Params extends ParameterSetDefinition,
  RequiredParams extends PossibleParameterKeys<Params>,
> = WidgetParameterReferences<Params, RequiredParams>;

export type WidgetOutputs<
  Params extends ParameterSetDefinition,
  RequiredParams extends PossibleParameterKeys<Params>,
> = WidgetParameterReferences<Params, RequiredParams>;

export type WidgetStepOutputs<
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

// Widget Step inputs are different than widget inputs/outputs or widget step outputs.
// They are purely the config values for the step, and not definitions that can be referenced
// as variables like you can with widget inputs and widget step outputs
export type WidgetStepInputs<
  InputParameters extends ParameterSetDefinition,
  RequiredInputs extends PossibleParameterKeys<InputParameters>,
> =
  & {
    // deno-lint-ignore no-explicit-any
    [k in RequiredInputs[number]]: any;
  }
  & {
    // deno-lint-ignore no-explicit-any
    [k in keyof InputParameters]?: any;
  };
