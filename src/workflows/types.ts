import { SlackManifest } from "../manifest/mod.ts";
import type { ManifestWorkflowSchema } from "../manifest/manifest_schema.ts";
import {
  ParameterPropertiesDefinition,
  ParameterSetDefinition,
  ParameterVariableType,
  PossibleParameterKeys,
} from "../parameters/types.ts";

export interface ISlackWorkflow {
  id: string;
  export: () => ManifestWorkflowSchema;
  registerStepFunctions: (manifest: SlackManifest) => void;
  registerParameterTypes: (manfest: SlackManifest) => void;
}

export type SlackWorkflowDefinition<Definition> = Definition extends
  SlackWorkflowDefinitionArgs<infer I, infer O, infer RI, infer RO, infer CB>
  ? SlackWorkflowDefinitionArgs<I, O, RI, RO, CB>
  : never;

export type SlackWorkflowDefinitionArgs<
  InputParameters extends ParameterSetDefinition,
  OutputParameters extends ParameterSetDefinition,
  RequiredInputs extends PossibleParameterKeys<InputParameters>,
  RequiredOutputs extends PossibleParameterKeys<OutputParameters>,
  CallbackID extends string,
> = {
  callback_id: CallbackID;
  title: string;
  description?: string;
  "input_parameters"?: ParameterPropertiesDefinition<
    InputParameters,
    RequiredInputs
  >;
  "output_parameters"?: ParameterPropertiesDefinition<
    OutputParameters,
    RequiredOutputs
  >;
};

export type WorkflowInputs<
  Params extends ParameterSetDefinition,
  RequiredParams extends PossibleParameterKeys<Params>,
> = WorkflowParameterReferences<Params, RequiredParams>;

export type WorkflowOutputs<
  Params extends ParameterSetDefinition,
  RequiredParams extends PossibleParameterKeys<Params>,
> = WorkflowParameterReferences<Params, RequiredParams>;

export type WorkflowStepOutputs<
  Params extends ParameterSetDefinition,
  RequiredParams extends PossibleParameterKeys<Params>,
> = WorkflowParameterReferences<Params, RequiredParams>;

type WorkflowParameterReferences<
  Params extends ParameterSetDefinition,
  Required extends PossibleParameterKeys<Params>,
> =
  & {
    [name in Required[number]]: ParameterVariableType<Params[name]>;
  }
  & {
    [name in keyof Params]?: ParameterVariableType<Params[name]>;
  };

// Workflow Step inputs are different than workflow inputs/outputs or workflow step outputs.
// They are purely the config values for the step, and not definitions that can be referenced
// as variables like you can with workflow inputs and workflow step outputs
export type WorkflowStepInputs<
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
