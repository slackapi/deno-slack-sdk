import { SlackManifest } from "../manifest.ts";
import type { ManifestWorkflowSchema } from "../types.ts";
import {
  ParameterSetDefinition,
  ParameterVariableType,
  RequiredParameters,
} from "../parameters/mod.ts";

export interface ISlackWorkflow {
  id: string;
  export: () => ManifestWorkflowSchema;
  registerStepFunctions: (manifest: SlackManifest) => void;
  registerParameterTypes: (manfest: SlackManifest) => void;
}

export type SlackWorkflowDefinitionArgs<
  InputParameters extends ParameterSetDefinition,
  OutputParameters extends ParameterSetDefinition,
  RequiredInputs extends RequiredParameters<InputParameters>,
  RequiredOutputs extends RequiredParameters<OutputParameters>,
> = {
  title: string;
  description?: string;
  "input_parameters"?: {
    required: RequiredInputs;
    properties: InputParameters;
  };
  "output_parameters"?: {
    required: RequiredOutputs;
    properties: OutputParameters;
  };
};

export type WorkflowInputsOutputsDefinition<
  Parameters extends ParameterSetDefinition,
> = {
  [name in keyof Parameters]: ParameterVariableType<
    Parameters[name]
  >;
};

export type WorkflowStepInputs<
  InputParameters extends ParameterSetDefinition,
  RequiredInputs extends RequiredParameters<InputParameters>,
> =
  & {
    // deno-lint-ignore no-explicit-any
    [k in RequiredInputs[number]]: any;
  }
  & {
    // deno-lint-ignore no-explicit-any
    [k in keyof InputParameters]?: any;
  };

// export type SlackWorkflow<Definition> = Definition extends
//   SlackWorkflowDefinitionArgs<infer I, infer O, infer RI, infer RO>
//   ? BaseSlackFunctionHandler<
//     FunctionRuntimeParameters<I, RI>,
//     FunctionRuntimeParameters<O, RO>
//   >
//   : never;
