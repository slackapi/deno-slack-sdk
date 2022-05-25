import { SlackManifest } from "../manifest.ts";
import { ManifestFunction, ManifestWorkflowStepSchema } from "../types.ts";
import { ISlackFunction } from "../functions/types.ts";
import {
  CreateUntypedObjectParameterVariable,
  ParameterSetDefinition,
  ParameterVariable,
  ParameterVariableType,
  RequiredParameters,
} from "../parameters/mod.ts";
import {
  WorkflowInputsOutputsDefinition,
  WorkflowStepInputs,
} from "./types.ts";

const localFnPrefix = "#/functions/";

export abstract class BaseWorkflowStepDefinition {
  protected stepId: string;

  protected functionReference: string;

  // deno-lint-ignore no-explicit-any
  protected inputs: WorkflowStepInputs<any, any>;

  constructor(
    stepId: string,
    functionReference: string,
    // deno-lint-ignore no-explicit-any
    inputs: WorkflowStepInputs<any, any>,
  ) {
    this.stepId = stepId;
    // ensures the function reference is a full path - local functions will only be passing in the function callback id
    this.functionReference = functionReference.includes("#/")
      ? functionReference
      : `${localFnPrefix}${functionReference}`;
    this.inputs = inputs;
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
      function_id: this.functionReference,
      inputs: this.templatizeInputs(),
    };
  }

  toJSON() {
    return this.export();
  }

  registerFunction(_manifest: SlackManifest) {
    // default is a noop, only steps using a function definition will register themselves on the manifest
  }

  protected isLocalFunctionReference(): boolean {
    return this.functionReference.startsWith(localFnPrefix);
  }
}

export class WorkflowStepDefinition<
  InputParameters extends ParameterSetDefinition,
  OutputParameters extends ParameterSetDefinition,
  RequiredInputs extends RequiredParameters<InputParameters>,
  RequiredOutputs extends RequiredParameters<OutputParameters>,
> extends BaseWorkflowStepDefinition {
  public definition: ISlackFunction<
    InputParameters,
    OutputParameters,
    RequiredInputs,
    RequiredOutputs
  >;

  public outputs: WorkflowInputsOutputsDefinition<
    OutputParameters
  >;

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
    super(stepId, slackFunction.id, inputs);

    this.definition = slackFunction;

    this.outputs = {} as WorkflowInputsOutputsDefinition<
      OutputParameters
    >;

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

  registerFunction(manifest: SlackManifest) {
    if (this.isLocalFunctionReference()) {
      manifest.registerFunction(this.definition as ManifestFunction);
    }
  }
}

export class UntypedWorkflowStepDefinition extends BaseWorkflowStepDefinition {
  public outputs: ReturnType<typeof CreateUntypedObjectParameterVariable>;

  constructor(
    stepId: string,
    functionReference: string,
    // deno-lint-ignore no-explicit-any
    inputs: WorkflowStepInputs<any, any>,
  ) {
    super(stepId, functionReference, inputs);

    this.outputs = CreateUntypedObjectParameterVariable(
      `steps.${stepId}`,
      "",
    );
  }
}
