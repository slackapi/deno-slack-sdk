import { ISlackFunctionDefinition } from "../functions/types.ts";
import type { ManifestWidgetSchema } from "../manifest/manifest_schema.ts";
import {
  ParameterPropertiesDefinition,
  ParameterSetDefinition,
  PossibleParameterKeys,
} from "../parameters/types.ts";

export interface ISlackWidget {
  id: string;
  export: () => ManifestWidgetSchema;
}

export enum SlackWidgetDataMode {
  PER_INSTALLER = "PER_INSTALLER",
  PER_USER = "PER_USER",
}

export interface SlackWidgetDependencies {
  [k: string]: SlackWidgetDependency;
}
export interface SlackWidgetDependency {
  function:
    | string
    | ISlackFunctionDefinition<
      ParameterSetDefinition,
      ParameterSetDefinition,
      PossibleParameterKeys<ParameterSetDefinition>,
      PossibleParameterKeys<ParameterSetDefinition>
    >;
  inputs?: {
    [k: string]: string;
  };
}

export interface SlackWidgetViewData {
  label: string;
  value: string;
}

export interface SlackWidgetViewAction {
  name: string;
  type: "link";
  url?: string;
}

export interface SlackWidgetView {
  type: string;
  title: string;
  data?: {
    [k: string]: SlackWidgetViewData;
  };
  actions?: {
    [k: string]: SlackWidgetViewAction;
  };
}

export type SlackWidgetDefinition<Definition> = Definition extends
  SlackWidgetDefinitionArgs<
    infer I,
    infer T,
    infer D,
    infer DM,
    infer WFID,
    infer IP,
    infer OP,
    infer RI,
    infer RO
  > ? SlackWidgetDefinitionArgs<I, T, D, DM, WFID, IP, OP, RI, RO>
  : never;

export type SlackWidgetDefinitionArgs<
  CallbackID extends string,
  Title extends string,
  Description extends string,
  DataMode extends SlackWidgetDataMode,
  WorkflowCallbackID extends string,
  InputParameters extends ParameterSetDefinition,
  OutputParameters extends ParameterSetDefinition,
  RequiredInputs extends PossibleParameterKeys<InputParameters>,
  RequiredOutputs extends PossibleParameterKeys<OutputParameters>,
> = {
  callback_id: CallbackID;
  title: Title;
  description: Description;
  data_mode: DataMode;
  workflow_callback_id?: WorkflowCallbackID;
  "input_parameters"?: ParameterPropertiesDefinition<
    InputParameters,
    RequiredInputs
  >;
  "output_parameters"?: ParameterPropertiesDefinition<
    OutputParameters,
    RequiredOutputs
  >;
  dependencies?: SlackWidgetDependencies;
  view?: SlackWidgetView;
};
