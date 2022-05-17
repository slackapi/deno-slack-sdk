import { SlackManifest } from "../manifest.ts";
import {
  ManifestFunction,
  ManifestWorkflowSchema,
  ManifestWorkflowStepSchema,
} from "../types.ts";
import { ISlackFunction } from "../functions/types.ts";
import {
  ParameterSetDefinition,
  ParameterVariable,
  ParameterVariableType,
  RequiredParameters,
} from "../parameters/mod.ts";
import {
  ISlackWorkflow,
  SlackWorkflowDefinitionArgs,
  WorkflowInputsOutputsDefinition,
  WorkflowStepInputs,
} from "./types.ts";

const localFnPrefix = "#/functions/";

export const DefineWorkflow = <
  Inputs extends ParameterSetDefinition,
  Outputs extends ParameterSetDefinition,
  RequiredInputs extends RequiredParameters<Inputs>,
  RequiredOutputs extends RequiredParameters<Outputs>,
>(
  id: string,
  definition: SlackWorkflowDefinitionArgs<
    Inputs,
    Outputs,
    RequiredInputs,
    RequiredOutputs
  >,
) => {
  return new WorkflowDefinition(id, definition);
};

export class WorkflowDefinition<
  Inputs extends ParameterSetDefinition,
  Outputs extends ParameterSetDefinition,
  RequiredInputs extends RequiredParameters<Inputs>,
  RequiredOutputs extends RequiredParameters<Outputs>,
> implements ISlackWorkflow {
  public id: string;
  private definition: SlackWorkflowDefinitionArgs<
    Inputs,
    Outputs,
    RequiredInputs,
    RequiredOutputs
  >;

  public inputs: WorkflowInputsOutputsDefinition<
    Inputs
  >;

  /* this one is a bit tricky, we collect here the workflow steps,
     these parameters are for the input / output parameters of the function that runs in that step
     and it's inputs will be of whatever shape, so this can't be typed using the WorkflowDefinition
     type parameters. The ParameterPropertiesDefinition<T> takes a Parameter set as T and uses that
     to define the "Required" type. So if we type the below to
     ParameterPropertiesDefinition<ParameterSetDefinition> it doesn't work, because the required sets
     of the function could be of a different shape. I couldn't find any way to make this work,
     other than let that one be `any` type.
  */
  steps: WorkflowStepDefinition<
    // deno-lint-ignore no-explicit-any
    any,
    // deno-lint-ignore no-explicit-any
    any,
    // deno-lint-ignore no-explicit-any
    any,
    // deno-lint-ignore no-explicit-any
    any
  >[] = [];

  constructor(
    id: string,
    definition: SlackWorkflowDefinitionArgs<
      Inputs,
      Outputs,
      RequiredInputs,
      RequiredOutputs
    >,
  ) {
    this.id = id;
    this.definition = definition;
    this.inputs = {} as WorkflowInputsOutputsDefinition<
      Inputs
    >;

    for (
      const [inputName, inputDefinition] of Object.entries(
        definition.input_parameters?.properties
          ? definition.input_parameters.properties
          : {},
      )
    ) {
      this.inputs[
        inputName as keyof Inputs
      ] = ParameterVariable(
        "inputs",
        inputName,
        inputDefinition,
      ) as ParameterVariableType<
        Inputs[typeof inputName]
      >;
    }
  }

  addStep<
    StepInputs extends ParameterSetDefinition,
    StepOutputs extends ParameterSetDefinition,
    RequiredStepInputs extends RequiredParameters<StepInputs>,
    RequiredStepOutputs extends RequiredParameters<StepOutputs>,
  >(
    slackFunction: ISlackFunction<
      StepInputs,
      StepOutputs,
      RequiredStepInputs,
      RequiredStepOutputs
    >,
    inputs: WorkflowStepInputs<StepInputs, RequiredStepInputs>,
  ): WorkflowStepDefinition<
    StepInputs,
    StepOutputs,
    RequiredStepInputs,
    RequiredStepOutputs
  > {
    const stepId = `${this.steps.length}`;

    const newStep = new WorkflowStepDefinition(
      stepId,
      slackFunction,
      inputs,
    );

    this.steps.push(newStep);

    return newStep;
  }

  export(): ManifestWorkflowSchema {
    return {
      title: this.definition.title,
      description: this.definition.description,
      input_parameters: this.definition.input_parameters,
      steps: this.steps.map((s) => s.export()),
    };
  }

  registerStepFunctions(manifest: SlackManifest) {
    this.steps.forEach((s) => s.registerFunction(manifest));
  }

  registerParameterTypes(manifest: SlackManifest) {
    const { input_parameters: inputParams, output_parameters: outputParams } =
      this.definition;
    manifest.registerTypes(inputParams?.properties ?? {});
    manifest.registerTypes(outputParams?.properties ?? {});
  }

  toJSON() {
    return this.export();
  }
}

class WorkflowStepDefinition<
  InputParameters extends ParameterSetDefinition,
  OutputParameters extends ParameterSetDefinition,
  RequiredInputs extends RequiredParameters<InputParameters>,
  RequiredOutputs extends RequiredParameters<OutputParameters>,
> {
  private stepId: string;

  public definition: ISlackFunction<
    InputParameters,
    OutputParameters,
    RequiredInputs,
    RequiredOutputs
  >;

  private inputs: WorkflowStepInputs<InputParameters, RequiredInputs>;

  public outputs: WorkflowInputsOutputsDefinition<
    OutputParameters
  >;
  private fnRef: string;
  constructor(
    stepId: string,
    slackFunction: ISlackFunction<
      InputParameters,
      OutputParameters,
      RequiredInputs,
      RequiredOutputs
    >,
    inputs: WorkflowStepInputs<InputParameters, RequiredInputs>,
  ) {
    this.stepId = stepId;
    this.definition = slackFunction;
    this.inputs = inputs;
    this.outputs = {} as WorkflowInputsOutputsDefinition<
      OutputParameters
    >;
    const fnId = this.definition.id;
    // TODO: This is hacky, will revamp this later to allow fns to handle namespaces
    this.fnRef = /^slack#/.test(fnId) ? fnId : localFnPrefix + fnId;

    // Setup step outputs for use in input template expressions
    for (
      const [outputName, outputDefinition] of Object.entries(
        slackFunction?.definition?.output_parameters?.properties ?? {},
      )
    ) {
      this.outputs[
        outputName as keyof OutputParameters
      ] = ParameterVariable(
        `steps.${this.stepId}`,
        outputName,
        outputDefinition,
      ) as ParameterVariableType<
        OutputParameters[typeof outputName]
      >;
    }
  }

  templatizeInputs() {
    const templatizedInputs: ManifestWorkflowStepSchema["inputs"] =
      {} as ManifestWorkflowStepSchema["inputs"];

    for (const [inputName, inputValue] of Object.entries(this.inputs)) {
      templatizedInputs[inputName] = JSON.parse(JSON.stringify(inputValue));
    }

    return templatizedInputs;
  }

  export(): ManifestWorkflowStepSchema {
    return {
      id: this.stepId,
      function_id: this.fnRef,
      inputs: this.templatizeInputs(),
    };
  }

  toJSON() {
    return this.export();
  }

  registerFunction(manifest: SlackManifest) {
    if (this.isLocalFunctionReference()) {
      manifest.registerFunction(this.definition as ManifestFunction);
    }
  }

  private isLocalFunctionReference(): boolean {
    return this.fnRef.startsWith(localFnPrefix);
  }
}
